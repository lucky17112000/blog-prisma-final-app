
import { email } from "better-auth";
import { prisma } from "../lib/prisma";
import { userRole } from "../middlware/auth";

async function seedAdmin() {
    try{
        console.log("sedding started,,,,,,,,,,..........");
        const adminData = {
            name:"Asaduzzaman Alamin",
            email:process.env.ADMIN_EMAIL as string,
            role:userRole.ADMIN,
            password:process.env.ADMIN_PASSWORD,
            // emailVerified:true

        }

        //cheak is user alredy exist or not
        const existingUser = await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        })
        if(existingUser){
            console.log("✅ Admin user already exists");
            await prisma.$disconnect();
            process.exit(0);
        }
        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email" , {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Origin": "http://localhost:5000"

            },
            body: JSON.stringify(adminData)
        })
        
        const responseText = await signUpAdmin.text();
        console.log("Response Status:", signUpAdmin.status);
        console.log("Response Body:", responseText);
        
        if(!signUpAdmin.ok) {
            throw new Error(`HTTP ${signUpAdmin.status}: ${responseText}`);
        }
        
        console.log("✅ Admin user created successfully");
        if(signUpAdmin.ok){
            await prisma.user.update({
                where:{
                    email:adminData.email
                },
                data:{
                    emailVerified:true
                }
            })
        }

        console.log("✅ Admin user email verified successfully");

    }catch(error){
        console.error("❌ Error seeding admin user:", error);
        process.exit(1);
    }finally{
        await prisma.$disconnect();
    }

}
seedAdmin();