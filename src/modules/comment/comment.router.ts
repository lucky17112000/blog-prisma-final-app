import express, { NextFunction , Request , Response , Router } from 'express';
import { CommentController } from './comment.controller';

import { auth,  userRole } from '../../middlware/auth';

// import { success } from 'better-auth';
const router  = express.Router();
router.get('/author/:authorId', CommentController.getCommentsByAuthor);
router.get('/:commentId', CommentController.getCommentsById);
router.post('/', auth(userRole.ADMIN , userRole.USER), CommentController.createComment)
router.delete('/:commentId',auth(userRole.ADMIN, userRole.USER), CommentController.deleteComment)
router.patch('/:commentId',auth(userRole.ADMIN, userRole.USER), CommentController.updateComment)
export const commentRouter = router;
 