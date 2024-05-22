import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import connectDB from './db/connectDB.js';
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js";
import cookieParser from 'cookie-parser'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/post',postRoutes)
app.use('/api/v1/comment',commentRoutes)

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const  message = err.message || "Internal Server Error"
    res.status(statusCode).json({
       success:false,
       statusCode,
       message
    })
})
const PORT = process.env.PORT || 2000;

const start = async ()=>{
    try {
        connectDB();
        
       
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error)
        
    }
}

start();