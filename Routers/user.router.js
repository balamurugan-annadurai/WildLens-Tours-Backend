import express from "express";
import { accountActivation, addBookingDetails, changePassword,forgotPassword,  login, register, verifyString} from "../Controllers/user.controller.js";

const router = express.Router(); // Create a new router object using Express

// Define routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/verifystring", verifyString);
router.post("/changepassword", changePassword);
router.post("/activateaccount", accountActivation);
router.post("/addBookingDetails", addBookingDetails);


export default router;
