import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { fetchDashboardSummary } from "../controller/transactionController.js";

const router = express.Router();

router.get('/',verifyToken,fetchDashboardSummary);

export default router;