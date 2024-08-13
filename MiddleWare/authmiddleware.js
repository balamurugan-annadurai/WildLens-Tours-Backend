import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Users from './../Models/user.schema.js';
dotenv.config();

const authMiddleware = (userRole) => async (req, res,next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.json({ message: "Token is missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const user = await Users.findById(req.user._id);
        if (user.role != userRole) {
            return res.status(401).json({ message: "Access denied" });
        }
        
        next();
        
    } catch (error) {
        console.log(error);
    }
}

export default authMiddleware;