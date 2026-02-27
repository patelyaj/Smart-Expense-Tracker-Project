import express from "express";
import { fetchBalance } from "../controllers/balanceController.js";

const router = express.Router();

router.get('/fetchbalance/:userId',fetchBalance);

export default router;