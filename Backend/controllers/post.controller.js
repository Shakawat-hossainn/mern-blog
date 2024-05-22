import { Post } from "../models/post.model.js"
import errorHandler from "../utils/error.js"




const createPost =async (req,res,next)=>{
  //  console.log(req.user)
    if(!req.user.isAdmin ){
        return next(errorHandler(403,"You are not allowed to create a post"))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,"All fields are required"))

    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')

    const newPost = new Post({
       ...req.body,
        slug: slug,
        userId: req.user.userId
    })
    try {
        
        const post = await newPost.save()
        return res.status(201).json({
            newPost
            
        })
    } catch (error) {
        next(error)
    }

}

const getPosts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0
      const limit = parseInt(req.query.limit) || 9
      const sortDirection = req.query.order === 'asc' ? 1 : -1
  
      // Build the query object
      let query = {}
  
      if (req.query.category) {
        query.category = req.query.category
      }
  
      if (req.query.postId) {
        query._id = req.query.postId
      }
  
      if (req.query.userId) {
        query.userId = req.query.userId
      }
  
      if (req.query.slug) {
        query.slug = req.query.slug
      }
  
      if (req.query.searchTerm) {
        query.$or = [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } }
        ]
      }
  
      const posts = await Post.find(query)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
  
      const now = new Date()
  
      const totalPosts = await Post.countDocuments()
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      )
  
      const lastMonthsPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo }
      })
  
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthsPosts
      })
    } catch (error) {
      next(error)
    }
  }
  
const deletePost = async(req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403,"You are not allowed to delete this post"))
    }
    if(req.user.userId!== req.params.userId){
        return next(errorHandler(403,"You are not allowed to delete this post"))
    }
    try {
        await Post.findByIdAndDelete(req.params.postId)
        res.status(200).json({message:"Post deleted successfully"})
    } catch (error) {
        next(error)
    }

}
const updatePost = async(req, res, next) => {
    // console.log(req.user)
    // console.log(req.params)
    if(!req.user.isAdmin || !req.user.userId=== req.params.userId){
         return next(errorHandler(403,"You are not allowed to update this post"))
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId,
            {
                $set:{
                    title:req.body.title,
                    content:req.body.content,
                    category:req.body.category,
                    image:req.body.image,

                  
                }
            }
            ,{new:true})
        res.status(200).json({updatedPost})
        
    } catch (error) {
       next(error)
        
    }

}

export {createPost, getPosts,deletePost,updatePost}