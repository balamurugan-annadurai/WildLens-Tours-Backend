import Bookings from "../Models/Booking.schema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../Models/user.schema.js";
dotenv.config();

export const bookTour = async (req, res) => {

    const { token, bookingDetails } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const booking = await Bookings.create({ userId, bookingDetails });
        res.status(200).json({ message: "Tour booked" });

    } catch (error) {
        console.log(error);
    }
}

export const getUserDetails = async (req, res) => {
    const { token } = req.body;

    try {
        const userId = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Users.findOne({ _id: userId }).select("firstName lastName email role");
        const bookings = await Bookings.find({ userId }).select('-_id bookingDetails status');
        
        res.status(200).json({ personalDetails: { user, bookings } });
    } catch (error) {
        console.log(error);
    }
}