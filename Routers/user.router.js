import express from "express";
import { accountActivation,bulkEmails,changePassword, dashboardDatas, forgotPassword, login, register, verifyString } from "../Controllers/user.controller.js";
import authMiddleware from './../MiddleWare/authmiddleware.js';

const router = express.Router(); // Create a new router object using Express

// Define routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/verifystring", verifyString);
router.post("/changepassword", changePassword);

router.get("/activateaccount", authMiddleware("user"), accountActivation);

router.get("/dashboarddatas", authMiddleware('admin'), dashboardDatas);
router.post("/sendbulkmail", authMiddleware('admin'), bulkEmails);


export default router;
