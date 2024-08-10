import express from "express";
import { createTour, getAllTours } from "../Controllers/tour.controller.js";
import authMiddleware from "../MiddleWare/authmiddleware.js";

const router = express.Router();

router.post("/createtour",authMiddleware("admin"), createTour);
router.get("/alltours", getAllTours);

export default router;