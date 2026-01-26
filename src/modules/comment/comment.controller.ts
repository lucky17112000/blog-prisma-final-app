import { Request, Response } from 'express';
import { CommentServices } from './comment.services';
const createComment = async(req:Request , res:Response )=>{
  try{
    const user = req.user;
    req.body.authorId = user?.id;
   
    const result  = await CommentServices.createComment(req.body);
    res.status(201).json(result);


  }catch(error){
    res.status(500).json({message:"Internal Server Error"});

  }
// res.send("create Post");
}
export const CommentController = {
    createComment
}