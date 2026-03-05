import express from "express";
import {
  fetchBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  fetchBudgetProgress
} from "../controllers/budgetController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/progress/:userId", verifyToken, fetchBudgetProgress);

router.get("/:userId", verifyToken, fetchBudget);

router.post("/create", verifyToken, createBudget);

router.patch("/:budgetId", verifyToken, updateBudget);

router.delete("/:budgetId", verifyToken, deleteBudget);

export default router;