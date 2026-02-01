import { NextFunction, Request, Response ,  } from 'express';
import { PostServices } from './post.services';
import { boolean } from 'better-auth';
import { postStatus } from '@prisma/client';
import paginationSortingHelper from '../../helper/paginationSortingHelper';
import { userRole } from '../../middlware/auth';


const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await PostServices.createPost(req.body, req.user.id);
    res.status(201).json(result);


  } catch (error) {
    next(error);
    

  }
  // res.send("create Post");
}
const getAllPosts = async (req: Request, res: Response) => {
  const { search } = req.query;
  const tags = req.query.tags ? req.query.tags.toString().split(',') : [];
  const isFeatured = req.query.isFeatured ? req.query.isFeatured === 'true' : undefined;
  const status = req.query.status as postStatus | undefined;
  const authorId = req.query.authorId as string | undefined;



  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
  // console.log(options);




  // console.log("Search Query:", search);
  try {
    const result = await PostServices.getAllPosts({ search: search as string, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });
    res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    console.log(postId);
    if (!postId) {
      throw new Error("Post ID is required");
    }

    const result = await PostServices.getPostById(postId as string);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await PostServices.getMyPosts(user.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
const updateOwnPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const postId = req.params.postId
    const isAdmin = (req.user?.role === userRole.ADMIN)
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await PostServices.updateOwnPost(postId as string, req.body, user.id, isAdmin);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


const deleteOwnPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const postId = req.params.postId
    const isAdmin = (req.user?.role === userRole.ADMIN)
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await PostServices.deleteOwnPost(postId as string, user.id, isAdmin);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
const getStats = async (req: Request, res: Response) => {
  try {



    const result = await PostServices.getStats();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "ernal Server Error" });
  }
}

export const PostController = {
  createPost, getAllPosts, getPostById, getMyPosts, updateOwnPost, deleteOwnPost, getStats
}