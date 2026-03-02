import express from "express";
import { fetchBalance } from "../controllers/balanceController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/fetchbalance/:userId',verifyToken,fetchBalance);

export default router;