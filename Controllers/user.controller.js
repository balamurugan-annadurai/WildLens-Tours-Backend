import Users from "../Models/user.schema.js"
import bcrypt from "bcryptjs"
import { mail, sendMail, verifyMail } from "../Services/nodemailer.services.js";
import randomString from "randomstring"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Bookings from './../Models/Booking.schema.js';
dotenv.config();


// Controller function to handle user registration
export const register = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {

        const user = await Users.findOne({ email });

        if (user) {
            return res.status(200).json({
                status: false,
                message: "User already registered"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newuser = await Users.create({ email, password: hashPassword, firstName, lastName });
        const token = jwt.sign({ _id: newuser._id }, process.env.JWT_SECRET);
        verifyMail(email, token);

        return res.status(201).json({
            status: true,
            message: "User registered"
        })

    } catch (error) {
        console.log(error);
    }
}

export const accountActivation = async (req, res) => {

    const userId = req.user._id;

    try {
        const user = await Users.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.activationStatus) {
            return res.status(200).json({ message: "Already activated" });
        }

        user.activationStatus = true;
        await user.save();

        res.status(200).json({ message: "activated" });

    } catch (error) {
        console.log(error);
    }
}

// Controller function to handle user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message: "User not found"
            })
        }
        if (!user.activationStatus) {
            return res.status(200).json({
                message: "User not activated"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        if (isMatch) {
            return res.status(200).json({
                message: "Password matched",
                token
            })
        }

        res.status(200).json({
            message: "login failed"
        })
    } catch (error) {
        console.log(error);
    }
}

// Controller function to handle forgot password requests
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(200).json({ message: "User not found" });
        }

        res.json({ message: "User found" });
        const randomStr = randomString.generate({
            length: 20,
            charset: "alphanumeric"
        })

        const expiryTime = new Date().getTime() + 600000;

        user.verificationString = randomStr;
        user.expiryTime = expiryTime;
        await user.save();
        mail(email, randomStr);

    } catch (error) {
        console.log(error);
    }
}

// Controller function to handle verification of password reset links
export const verifyString = async (req, res) => {
    const { verificationString } = req.body;
    const user = await Users.findOne({ verificationString });
    const currentTime = new Date().getTime();
    if (!user) {
        return res.json({ message: "not match" })
    }

    if (user.expiryTime < currentTime) {
        user.verificationString = null;
        user.expiryTime = null;
        await user.save();
        return res.json({ message: "link expired" });
    }

    res.status(200).json({ message: "matched" });
}

// Controller function to handle password changes
export const changePassword = async (req, res) => {
    const { verificationString, newPassword } = req.body;
    const user = await Users.findOne({ verificationString });

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.verificationString = null;
    user.expiryTime = null;
    await user.save();

    res.status(200).json({ message: "Password changed" });
}

export const dashboardDatas = async (req, res) => {
    const userId = req.user._id;
    try {
        const users = await Users.find({ role: 'user' }).select('-_id firstName lastName email');
        const bookings = await Bookings.find();
        const completedTours = await Bookings.find({ status: "completed" });
        const pendingTours = await Bookings.find({ status: "pending" });

        const datas = {
            users,
            totalUser: users.length,
            totalBookings: bookings.length,
            completedTours: completedTours.length,
            pendingTours: pendingTours.length
        }

        res.status(200).json({ datas })
    } catch (error) {
        console.log(error);
    }
}

export const bulkEmails = async (req, res) => {
    const { subject, content } = req.body;
    try {
        const users = await Users.find({ role: 'user' }).select('-_id email');
        users.forEach(user => {
            sendMail(user.email, subject, content);
        })
        console.log(users);
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
    }
}