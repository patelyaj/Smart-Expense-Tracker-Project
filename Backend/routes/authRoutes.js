import express from "express";
import { logoutUser, registerUser, updateProfile } from "../controllers/authControllers.js";
import { loginUser } from "../controllers/authControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser);

router.post("/updateProfile/:id", verifyToken , updateProfile);

export default router;