import express from "express";

import authRoutes from './authRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import budgetRoutes from './budgetRoutes.js'


const router = express.Router();

router.use('/users',authRoutes);
router.use('/transactions',transactionRoutes);
router.use('/categories',categoryRoutes);
router.use('/budget',budgetRoutes);

export default router;