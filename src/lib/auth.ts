import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL || "http://localhost:5000"],
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true

    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,

        sendVerificationEmail: async ({ user, url, token }, request) => {
            // console.log(user , url, token);
            try {
                const verification_url = process.env.APP_URL + `/verify-email?token=${token}`;
                const info = await transporter.sendMail({
                    from: `"APP BLOG" <${process.env.APP_USER}>`,
                    to: user.email,
                    subject: `Hello ${user.name} ✔`,
                    text: "Hello world?", // Plain-text version of the message
                    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      margin-top: 25px;
      padding: 12px 28px;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Verify Your Email  </h1>
    <p>Thanks for creating an account with us 🎉</p>
    <p>Please click the button below to verify your email address.</p>

    <a href="${verification_url}" class="btn">Verify Email</a>

    <p style="margin-top:20px;">
      If the button doesn’t work, copy and paste this link into your browser:
    </p>

    <p style="word-break: break-all;">
      ${verification_url}
    </p>

    <div class="footer">
      <p>If you didn’t create this account, you can ignore this email.</p>
      <p>© ${new Date().getFullYear()} APP BLOG</p>
    </div>
  </div>
</body>
</html>
`, // HTML version of the message
                });

                console.log("Message sent:", info.messageId);

            } catch (error) {
                console.error("Error sending verification email:", error);
            }
        },
    },
    socialProviders: {
        google: {
           accessType: "offline", 
           prompt: "select_account consent",
            clientId: process.env.GOOGLE_CLIENT_ID as string,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
           
            //  allowDangerousEmailAccountLinking: true

        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false

            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    }

});