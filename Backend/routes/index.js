import express from "express";

import authRoutes from './authRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/dashboard',dashboardRoutes);
router.use('/users',authRoutes);
router.use('/transactions',transactionRoutes);
router.use('/categories',categoryRoutes);
router.use('/budget',budgetRoutes);

export default router;