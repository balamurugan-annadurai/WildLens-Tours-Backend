import mongoose from "mongoose";

// Define the schema for the User model
const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    bookingDetails: {
        type: Object
    },
    status: {
        type: String,
        default:"pending"
    }
})

// Create a Mongoose model named 'Users' based on the userSchema
const Bookings = mongoose.model("Bookings", bookingSchema);

export default Bookings;