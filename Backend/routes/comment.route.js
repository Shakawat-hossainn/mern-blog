import {Router} from 'express'
import express from 'express'
import verifyToken from '../utils/verifyUser.js'
import { createComment, deleteComment, editComment, getAllComments, getComments, likeComment } from '../controllers/comment.controller.js'
const router = express.Router()


router.post('/create',verifyToken,createComment)
router.get('/getcomments/:postId', getComments)
router.patch('/likecomment/:commentId', verifyToken,likeComment)
router.patch('/editcomment/:commentId', verifyToken,editComment)
router.delete('/deletecomment/:commentId', verifyToken,deleteComment)
router.get('/getcomments',verifyToken,getAllComments)



export default router