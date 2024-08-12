import mongoose from "mongoose";

// Define the comment schema for comments on reviews
const commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema] // Comments on the review
});

const tourSchema = mongoose.Schema({
    img: String,
    name: String,
    country: String,
    price: Number,
    duration: String,
    shortDescription: String,
    title: String,
    travellersLimit:Number,
    durationAndLimit: String,
    sections: {
        type: Array,
        default: []
    },
    reviews: [reviewSchema] // Reviews
});

const Tours = mongoose.model("Tours", tourSchema);

export default Tours;
