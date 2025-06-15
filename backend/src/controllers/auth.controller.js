import bcrypt from 'bcryptjs'
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/clodinary.js';
 
export const signup = async (req,res)=>{
    const {fullName,email, password} = req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({
                msg: 'All fields are required'
            })
        }
        if(password.length <6){
            return res.status(400).json({
                msg: 'Passoword must be at least 6 characters'
            })
        }
        const user =await  User.findOne({email});
        if(user){
            return res.status(400).json({
                msg: 'Email already exists'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const  hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if(newUser){
            const token = generateToken(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                msg: 'User registered successfully',
                newUser,
                token
            })
        }
        else{
            return res.status(400).json({
                msg: 'Invalid user data'
            })
        }
    }
    catch(err){
        return res.status(500).json({
            msg: 'Error while signing up',
            error: err.message
        })
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            msg: 'Enter email and password'
        })
    }
    try{
        const userExists = await User.findOne({email});
        if(!userExists){
            return res.status(400).json({
                msg: 'Incorrect email or password'
            })
        }
        const hashedPassword = userExists.password;
        const isMatch = await bcrypt.compare(password,hashedPassword);
        if(!isMatch){
            return res.status(400).json({
                msg: 'Incorrect email or password'
            })
        }
        const token = generateToken(userExists._id,res);
        return res.status(200).json({
            token
        })
    }
    catch(err){
        return res.status(500).json({
            msg: 'Unable to login user',
            error: err.message
        })
    }
}

export const logout = (req,res)=>{
    try{
        res.cookie("jwt", "",{maxAge: 0});
        res.status(200).json({msg: "Logged out succsessfully"}) 
    }
    catch(err){
        console.log("Error in logout controller",err.message);
        return res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

export const updateProfile = async (req,res)=>{
    try{
        const {profilePic}  = req.body;
        const  userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({
                message: "Profile pic is required"
            })
        }
        const uploadResponse  = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic: uploadResponse.secure_url},{new:true})
        res.status(200).json({
            updatedUser
        })
    }   
    catch(err){
        console.log(err.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}