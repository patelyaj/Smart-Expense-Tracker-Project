import express from "express";
import {
  fetchBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  fetchBudgetProgress,
  getBudgetDetails
} from "../controllers/budgetController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/progress/:userId", verifyToken, fetchBudgetProgress);
router.get("/details/:budgetId", verifyToken, getBudgetDetails);
router.get("/:userId", verifyToken, fetchBudget);

router.post("/create", verifyToken, createBudget);

router.patch("/:budgetId", verifyToken, updateBudget);

router.delete("/:budgetId", verifyToken, deleteBudget);

export default router;