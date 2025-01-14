import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async(req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json('User Created Successfully!!!');
    } catch (error) {
        //res.status(500).json(error.message);
        next(error);
    }
};


export const signin = async(req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({ email });        //findOne is given ny mongoose to find the requirement in database
        if(!validUser)
            return next(errorHandler(404, "User not found!!"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword)
            return next(errorHandler(401, "Wrong credentials!!"));

        const token  = jwt.sign({ id:validUser._id }, process.env.JWT_SECRET)     //creating a cookie here
        const {password : pass, ...rest} = validUser._doc;      //sending the rest of the details other than password
        res.
            cookie('access_token', token, {httpOnly : true})
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};


export const google = async(req, res, next) => {
    try {
        const user = await User.findOne({ email : req.body.email })
        if(user) {                                                        //if user exists
            const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET);
            const { password: pass, ...rest} = user._doc;
            res
                .cookie("access_token", token, {httpOnly: true})
                .status(200)
                .json(rest);
        }else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);                 //random 16digits password
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() 
                                   + Math.random().toString(36).slice(-4), 
                                   email: req.body.email, 
                                   password: hashedPassword, 
                                   avatar: req.body.photo,
                                });  
            await newUser.save();

            const token = jwt.sign( { id: newUser._id}, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;

            res
                .cookie("access_token", token, {httpOnly: true})
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};
