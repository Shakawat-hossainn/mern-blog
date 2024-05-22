import { Comment } from "../models/comment.model.js"
import errorHandler from "../utils/error.js";



const createComment = async(req,res,next) => {
    console.log(req.user.userId)
   
    const {content,postId,userId} = req.body
    console.log(req.body)
try {
    if(userId !== req.user.userId){
        return next(errorHandler(403,"You are not allowed to comment on this post"))
    }
    if (!content || !postId || !userId) {
        return next(errorHandler(400, "Content, Post ID, and User ID are required"));
    }


 const newComment = new Comment({
   content,userId,postId
    
 })


 await newComment.save()
    res.status(200).json(newComment)
} catch (error) {
    next(error)
    
}


}
const getComments = async(req,res,next) => {
    const postId = req.params.postId
    try {
        const comments = await Comment.find({postId})
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}
const likeComment = async(req,res,next) => {
  //  console.log(req.user)

    const comment = await Comment.findById(req.params.commentId)
    
    try {
     if(!comment){
         return next(errorHandler(404,"Comment not found"))

     }
     
     const userIndex = comment.likes.indexOf(req.user.userId)
     if(userIndex === -1){
         comment.likes.push(req.user.userId)
     }else{
         comment.likes.splice(userIndex,1)
     }
     await comment.save()
     res.status(200).json(comment)
        
    } catch (error) {
        next(error)
        
    }



}
const editComment = async(req, res,next) => {
    const comment = await Comment.findById(req.params.commentId)
    
  
    try {
        if (!comment) {
          return next(errorHandler(404, "Comment not found"));
        }
        if (comment.userId !== req.user.userId && !req.user.isAdmin) {
          return next(errorHandler(403, "You are not allowed to edit this comment"));
        }
        if (!req.body.content) {
          return next(errorHandler(400, "Content is required"));
        }
        
        const editedComment = await Comment.findByIdAndUpdate(
          req.params.commentId,
          {
            $set: {
              content: req.body.content,
            },
          },
          { new: true } // This option returns the updated document
        );
    
        res.status(200).json(editedComment);
      } catch (error) {
        next(error);
      }}
      const deleteComment = async(req,res,next) => {
       // console.log(req)
        const comment = await Comment.findById(req.params.commentId)
         try {
             if (!comment) {
               return next(errorHandler(404, "Comment not found"));
             }
             if (comment.userId!== req.user.userId &&!req.user.isAdmin) {
               return next(errorHandler(403, "You are not allowed to delete this comment"));
             }
             await Comment.findByIdAndDelete(req.params.commentId)
          //  await comment.deleteOne()
             res.status(200).json("Comment deleted successfully")
         } catch (error) {
             next(error)
         }
      }
      const getAllComments = async (req, res) => {
        if(!req.user.isAdmin){
          return next(errorHandler(403,"You are not allowed to view all comments"))
        }
        try {
           const startIndex = parseInt(req.query.startIndex) || 0
           const limit = parseInt(req.query.limit) || 9
           const sortDirection = req.query.sort === 'asc'? 1:-1
           const comments = await Comment.find().sort({updatedAt:sortDirection}).skip(startIndex).limit(limit)
           const totalComments = await Comment.find().countDocuments()
           const now = new Date()
           const oneMonthsAgo = new Date(
             now.getFullYear(),
             now.getMonth() - 1,
             now.getDate()
           )
           const lastMonthsComments = await Comment.find({updatedAt:{$gte:oneMonthsAgo}}).countDocuments()

           res.status(200).json({
             comments,
             totalComments,
             lastMonthsComments
           })
         

        } catch (error) {
          next(error)
          
        }
      }
export{createComment,getComments,likeComment,editComment,deleteComment,getAllComments}