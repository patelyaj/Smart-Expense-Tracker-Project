import express from "express";
import {
  createBudget,
  deleteBudget,
  getBudgetDetails,
  fetchBudgetsWithProgress
} from "../controller/budgetController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.get("/progress/:userId", verifyToken, fetchBudgetProgress);
// router.get("/:userId", verifyToken, fetchBudget);
router.get('/',verifyToken,fetchBudgetsWithProgress)

router.get("/:budgetId", verifyToken, getBudgetDetails);

// add
router.post("/", verifyToken, createBudget);
// delete
router.delete("/:budgetId", verifyToken, deleteBudget);

export default router;