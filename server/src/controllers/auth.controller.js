import { log } from "console";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import "dotenv/config";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: 'Invalid email format'});
        }

        const user = await User.findOne({email});
        if(user){
            console.log("User already exists with email:", email);
            return res.status(400).json({message: 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        })

        if(newUser){
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }

        // Send welcome email
        try {
            await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
        } catch (error) {
            return res.status(500).json({message: 'Error sending welcome email'});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal server error'});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user =  await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const logout = (_, res) => {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});
}