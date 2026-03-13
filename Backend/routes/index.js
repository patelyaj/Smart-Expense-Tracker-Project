import express from "express";
import authRoutes from './authRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import budgetRouter from './budgetRoutes.js'


const router = express.Router();

router.use('/users',authRoutes);
router.use('/transactions',transactionRoutes);
router.use('/categories',categoryRoutes);
router.use('/budget',budgetRouter);

export default router;
