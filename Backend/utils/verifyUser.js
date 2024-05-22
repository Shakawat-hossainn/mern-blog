import jwt from 'jsonwebtoken'
//import bcryptjs from 'bcryptjs'

import errorHandler from './error.js'


const verifyToken =(req,res,next)=>{
    const token = req.cookies.access_token  // need to signout then signin again to acquire the access token
    //console.log(req)
    if(!token){
        next(errorHandler(401,"Unauthorized"))
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{    // user means the decoded info from the token
        if(err){
            next(errorHandler(401,"Unauthorized"))
        }
        req.user = user
        next()

    })
}


export default verifyToken

