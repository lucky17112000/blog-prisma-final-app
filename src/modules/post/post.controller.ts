import { Request, Response } from 'express';
import { PostServices } from './post.services';
import { boolean } from 'better-auth';
import { postStatus } from '@prisma/client';


const createPost = async(req:Request , res:Response )=>{
  try{
   if(!req.user){
    return res.status(401).json({message:"Unauthorized"});
   }
    const result  = await PostServices.createPost(req.body , req.user.id );
    res.status(201).json(result);


  }catch(error){
    res.status(500).json({message:"Internal Server Error"});

  }
// res.send("create Post");
}
const getAllPosts = async(req:Request , res:Response )=>{
  const {search} = req.query;
  const tags = req.query.tags?req.query.tags.toString().split(','):[];
  const isFeatured = req.query.isFeatured?req.query.isFeatured==='true':undefined;
  const status =  req.query.status as postStatus | undefined  ;
  const authorId = req.query.authorId as string | undefined;


  // console.log("Search Query:", search);
  try{
    const result  = await PostServices.getAllPosts({search:search as string, tags , isFeatured , status , authorId});
    res.status(200).json(result);

  }catch(error){
    return res.status(500).json({message:"Internal Server Error"});
  }
}
export const PostController = {
    createPost, getAllPosts
}