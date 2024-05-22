import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    username:{
      type: String,
      required:true,
      
    },
    email:{
      type: String,
      required:true,
      unique:true,
      
    },
    password:{
      type: String,
      required:true,
      
    },
    googlePhoto:{
      type: String,
      default:"https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"

    },
    isAdmin:{
      type: Boolean,
      default:false,
      
    }
  },{timestamps:true})
  userSchema.index({ email: 1}, { unique: true })

  export const User = mongoose.model('User',userSchema);