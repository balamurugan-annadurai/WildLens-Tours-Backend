import express from "express";
import { bookTour, getUserDetails, } from "../Controllers/booking.controller.js";

const router = express.Router();

router.post("/booktour", bookTour);
router.post("/getuserdetails",getUserDetails);


export default router;