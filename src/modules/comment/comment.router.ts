import express, { NextFunction , Request , Response , Router } from 'express';
import { CommentController } from './comment.controller';

import { auth,  userRole } from '../../middlware/auth';

// import { success } from 'better-auth';
const router  = express.Router();
router.post('/', auth(userRole.ADMIN , userRole.USER), CommentController.createComment)

export const commentRouter = router;
