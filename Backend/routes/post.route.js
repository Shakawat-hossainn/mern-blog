import { Router } from "express"
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post.controller.js"
import verifyToken from "../utils/verifyUser.js"
import express from "express"


const route = express.Router()

route.post('/create',verifyToken,createPost)
route.get('/getposts',getPosts)
route.delete('/delete/:postId/:userId',verifyToken,deletePost)
route.patch("/update/:postId/:userId",verifyToken,updatePost)


export default route