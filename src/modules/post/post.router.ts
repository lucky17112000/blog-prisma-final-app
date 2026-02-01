import express, { NextFunction , Request , Response , Router } from 'express';
import { PostController } from './post.controller';
  
import { auth, userRole } from '../../middlware/auth';
// import { success } from 'better-auth';
const router  = express.Router();
router.get('/', PostController.getAllPosts)



router.post('/' ,auth(userRole.ADMIN , userRole.USER),PostController.createPost);
router.get('/:postId' ,  PostController.getPostById);
router.get('/my/posts' , auth(userRole.USER, userRole.ADMIN) , PostController.getMyPosts);
router.patch('/:postId', auth(userRole.USER, userRole.ADMIN ) , PostController.updateOwnPost);
router.delete('/:postId', auth( userRole.USER , userRole.ADMIN) , PostController.deleteOwnPost);
export const postRouter = router;
