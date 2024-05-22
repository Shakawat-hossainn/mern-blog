import dotenv from 'dotenv'

dotenv.config()

import mongoose from 'mongoose'


const connectionString =process.env.MONGO_URI


const connectDB = () =>{
    mongoose.connect(connectionString)
   .then(() => console.log('MongoDB Connected...')).catch((error) => console.log(error))
}


export default connectDB