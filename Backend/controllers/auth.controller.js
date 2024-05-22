import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import errorHandler from '../utils/error.js';

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, "All Fields Are Required"));
    }

    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const {password : pass, ...rest} = newUser._doc
        res.status(201).json({rest });
    } catch (error) {
        next(error);
    }
};

const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, "All Fields Are Required"));
    }

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(400, "Invalid Credentials"));
        }

        const isPasswordValid = await bcryptjs.compare(password, validUser.password);

        if (!isPasswordValid) {
            return next(errorHandler(400, "Invalid Credentials"));
        }

        const { password: pass, ...rest } = validUser._doc;

        const token = jwt.sign({ userId: validUser._id,isAdmin:validUser.isAdmin }, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
        });

        res.status(200).json({  rest });
    } catch (error) {
        next(error);
    }
};

const google = async (req, res, next) => {
    const { displayName, email, photoURL } = req.body;
    //console.log(req.body);

    try {
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ userId: user._id,isAdmin:user.isAdmin }, process.env.JWT_SECRET);
            res.cookie('access_token', token, {
                httpOnly: true,
            });
            
            
            res.status(200).json({name:displayName.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4), email:email, googlePhoto:photoURL,userId: user._id,isAdmin:user.isAdmin });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: displayName.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                googlePhoto: photoURL
            });

            await newUser.save();
           // const { password: pass, ...rest } = validUser._doc;

            const token = jwt.sign({ userId: newUser._id,isAdmin:newUser.isAdmin }, process.env.JWT_SECRET);
            res.cookie('access_token', token, {
                httpOnly: true,
            });

            res.status(200).json({name:username, email:email, googlePhoto:photoURL});
        }
    } catch (error) {
        next(error);
    }
};

export { signup, signin, google };
