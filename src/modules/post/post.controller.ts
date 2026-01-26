import { Request, Response } from 'express';
import { PostServices } from './post.services';


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

  // console.log("Search Query:", search);
  try{
    const result  = await PostServices.getAllPosts({search:search as string, tags});
    res.status(200).json(result);

  }catch(error){
    return res.status(500).json({message:"Internal Server Error"});
  }
}
export const PostController = {
    createPost, getAllPosts
}