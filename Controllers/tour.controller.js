import mongoose from "mongoose";
import Tours from "../Models/tour.schems.js";
import Users from "../Models/user.schema.js";

export const createTour = async (req, res) => {
    const tourDetails = req.body;
    const newTour = await Tours.create(tourDetails);

    res.status(201).json({ message: "Tour created", newTour });
}

export const getAllTours = async (req, res) => {

    const allTours = await Tours.find();
    res.status(200).json({ tours: allTours });
}

export const addReview = async (req, res) => {
    const userId = req.user._id;
    const { tourId, rating, content } = req.body;

    try {
        const user = await Users.findOne({ _id: userId });
        const userName = `${user.firstName} ${user.lastName}`;
        const tour = await Tours.findOne({ _id: tourId });

        const review = {
            userId,
            userName,
            rating,
            content
        }

        tour.reviews.push(review);
        tour.save();
        const newReview = tour.reviews[tour.reviews.length - 1];
        res.status(201).json({ message: "Review added", newReview });
    } catch (error) {
        console.log(error);
    }
}

export const updateUserActions = async (req, res) => {
    const userId = req.user._id;
    try {
        const { reviewId, likedUsers, dislikedUsers, likes, dislikes, content } = req.body;
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).send({ message: 'Invalid review ID format' });
        }

        // Find the document containing the review
        const tour = await Tours.findOne({
            "reviews._id": new mongoose.Types.ObjectId(reviewId)
        });

        if (!tour) {
            return res.status(404).send({ message: 'Tour not found' });
        }

        // Find the specific review
        const review = tour.reviews.find(r => r._id.toString() === reviewId);

        review.likedUsers = likedUsers
        review.dislikedUsers = dislikedUsers
        review.likes = likes
        review.dislikes = dislikes
        review.content = content || review.content;

        await tour.save();

        if (!review) {
            return res.status(404).send({ message: 'Review not found' });
        }

        res.status(200).json({ message: "success", review });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
}

export const saveContent = async (req, res) => {
    const userId = req.user._id;
    try {
        const { reviewId, content } = req.body;
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).send({ message: 'Invalid review ID format' });
        }

        // Find the document containing the review
        const tour = await Tours.findOne({
            "reviews._id": new mongoose.Types.ObjectId(reviewId)
        });

        if (!tour) {
            return res.status(404).send({ message: 'Tour not found' });
        }

        // Find the specific review
        const review = tour.reviews.find(r => r._id.toString() === reviewId);

        review.content = content;

        await tour.save();

        if (!review) {
            return res.status(404).send({ message: 'Review not found' });
        }

        res.status(200).json({ message: "success", review });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
}

export const deleteReview = async (req, res) => {
    const userId = req.user._id;
    try {
        const { reviewId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).send({ message: 'Invalid review ID format' });
        }

        // Find the tour and remove the review
        const tour = await Tours.findOneAndUpdate(
            { "reviews._id": reviewId },
            { $pull: { reviews: { _id: reviewId } } },
            { new: true }
        );

        if (!tour) {
            return res.status(404).send({ message: 'Tour not found' });
        }

        res.status(200).json({ message: 'deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
};

