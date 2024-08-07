import Tours from "../Models/tour.schems.js";

export const createTour = async (req, res) => {
    const tourDetails = req.body;
    const newTour = await Tours.create(tourDetails);

    res.status(201).json({ message: "Tour created", newTour });
}

export const getAllTours = async (req, res) => {

    const allTours = await Tours.find();
    res.status(200).json({ tours: allTours });
}