import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        postId:{
            type:String,
            required:true,
        },
        userId:{
            type:String,
            required:true,
        },
       likes:{
        type:Array,
        default:[]
       },
       numberOfLikes:{
        type:Number,
        default:0
       },
       content:{
        type: String,
        required:true,
       },
       

    },{timestamps:true});

    export const Comment = mongoose.model('Comment',commentSchema);