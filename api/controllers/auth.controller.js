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
}
