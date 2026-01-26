import express, { NextFunction , Request , Response , Router } from 'express';
import { PostController } from './post.controller';
import {auth as betterAuth} from '../../lib/auth';  
import { auth, userRole } from '../../middlware/auth';
// import { success } from 'better-auth';
const router  = express.Router();
router.get('/', PostController.getAllPosts)



router.post('/' ,auth(userRole.ADMIN , userRole.USER),PostController.createPost);
router.get('/:postId' ,  PostController.getPostById);
export const postRouter = router;
