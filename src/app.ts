import express, { Application } from 'express';
import { postRouter } from './modules/post/post.router';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { commentRouter } from './modules/comment/comment.router';
import errorHandler from './middlware/globalErrorHandler';
import { notFound } from './middlware/notFound';
const app:Application  = express();
app.use(cors ({
    origin: process.env.APP_URL || "http://localhost:5000",//clientsite url
    credentials:true
}))
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());
app.use("/posts", postRouter)
app.use("/comments", commentRouter);

app.use(errorHandler);
app.use(notFound);




export default app;