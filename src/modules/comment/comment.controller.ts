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

const getCommentsById = async(req:Request , res:Response )=>{
  try{
    const {commentId} = req.params
   
    const result  = await CommentServices.getCommentsById(commentId as string);
    res.status(201).json(result);


  }catch(error){
    res.status(500).json({message:"Internal Server Error"});

  }
// res.send("create Post");
}
const getCommentsByAuthor = async(req:Request , res:Response )=>{
  try{
    const {authorId} = req.params
   
    const result  = await CommentServices.getCommentsByAuthor(authorId as string);
    res.status(201).json(result);


  }catch(error){
    res.status(500).json({message:"Internal Server Error"});

  }
// res.send("create Post");
}


const deleteComment = async(req:Request , res:Response )=>{
  try{
    const user = req.user;
    const {commentId} = req.params;
   
   
    const result  = await CommentServices.deleteComment(commentId as string, user?.id as string);
    res.status(201).json(result);


  }catch(error){
    res.status(500).json({message:"Internal Server Error"});

  }
// res.send("create Post");
}


const updateComment = async(req:Request , res:Response )=>{
  try{
    const user = req.user;
    const {commentId} = req.params;
   
   
    const result  = await CommentServices.updateComment(commentId as string,req.body, user?.id as string);
    res.status(201).json(result);


  }catch(error){
    res.status(500).json({message:"Internal Server Error"});

  }
// res.send("create Post");
}

export const CommentController = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment,
    updateComment
}