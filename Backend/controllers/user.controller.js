import { User } from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import errorHandler from "../utils/error.js"


const updateUser =async (req,res,next) =>{
//    console.log(req.user)
 if(req.user.userId !== req.params.userId){
     return next(errorHandler(403,"You are not allowed to update this user"))

     }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400,"Password must be at least 6 characters"))
        }}
        if(req.body.username){
            if(req.body.username.length < 7 || req.body.username.length > 20){
                 return next(errorHandler(400,"Username must be between 7 and 20 characters"))
            }
            if(req.body.username.includes(' ')){
                return next(errorHandler(400,"Username must not contain spaces"))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400,"Username must be lowercase"))


            }
          
        }
       // console.log(req.body)

        try {
            const hashedPassword = await bcryptjs.hashSync(req.body.password,10)
            const updatedUser = await User.findByIdAndUpdate(req.params.userId,{
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    password: hashedPassword,
                    googlePhoto:req.body.profilePicture
                },
            
                
            },{new:true})
            const {password, ...rest} = updatedUser._doc
            res.status(200).json(rest)
          
        } catch (error) {
            next(error)
            
        }
    
}
const deleteUser =async(req,res,next)=>{
    console.log(req.user)
    
if(!req.user.isAdmin &&  req.user.userId !== req.params.userId){
    return next(errorHandler(403,"You are not allowed to delete this user"))


}
     try {
         await User.findByIdAndDelete(req.params.userId)
         res.status(200).json({message:"User deleted successfully"})
     } catch (error) {
         next(error)
     }

}
const signout = (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'User signed out successfully' });
}


const getUsers = async(req, res,next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403,"You are not allowed to see this user"))
    }
    try {
     const startIndex = parseInt(req.query.startIndex) || 0;
     const limit = parseInt(req.query.limit) || 9
     const sortDirection = req.query.sort === 'asc'? 1:-1
        const users = await User.find().sort({updatedAt:sortDirection}).skip(startIndex).limit(limit)
            
        const userWithoutPassword =  users.map((user)=>{
            const {password,...rest} = user._doc
            return rest
        })
        const now = new Date()
        const totalUsers = await User.find().countDocuments()
        const oneMonthsAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
       
        const lastMonthsUsers = await User.find({updatedAt:{$gte:oneMonthsAgo}}).countDocuments()
        
        res.status(200).json({
            users:userWithoutPassword,
            totalUsers,
            lastMonthsUsers
        })



        
        
    } catch (error) {
        next(error)
        
    }

}
const getUser = async(req,res,next) => {
    try {
        const user = await User.findById(req.params.userId)
        const {password,...rest} = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
        
    }
}



export {updateUser,deleteUser,signout,getUsers,getUser}