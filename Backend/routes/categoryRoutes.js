import { fetchCategories } from "../controllers/categoryController.js";
import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import e from "express";

const router = express.Router();

router.get("/fetchcategories", verifyToken, fetchCategories);

export default router;