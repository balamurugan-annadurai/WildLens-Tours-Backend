import express from "express";
import { addReview, createRazorpayOrder, createTour, deleteReview, getAllTours, saveContent, updateUserActions } from "../Controllers/tour.controller.js";
import authMiddleware from "../MiddleWare/authmiddleware.js";

const router = express.Router();

router.post("/createtour", authMiddleware("admin"), createTour);
router.get("/alltours", getAllTours);
router.post("/addreview", authMiddleware("user"), addReview);

router.patch("/updateuseraction", authMiddleware("user"), updateUserActions);
router.patch("/savecontent", authMiddleware("user"), saveContent);

router.post("/deletereview", authMiddleware("user"), deleteReview);

router.delete('/reviews/:reviewId', authMiddleware("user"), deleteReview);

router.post('/create-order', createRazorpayOrder);

export default router;