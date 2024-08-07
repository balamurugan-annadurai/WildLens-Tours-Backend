import express from "express";
import { createTour, getAllTours } from "../Controllers/tour.controller.js";

const router = express.Router();

router.post("/createtour", createTour);
router.get("/alltours", getAllTours);

export default router;