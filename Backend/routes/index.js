import express from "express";
import authRoutes from './authRoutes.js';
import transactionRouter from './transactionRoutes.js';
import categoryRouter from './categoryRoutes.js';
import budgetRouter from './budgetRoutes.js';


const router = express.Router();

router.use('/users',authRoutes);
router.use('/transactions',transactionRouter);
router.use('/categories',categoryRouter);
router.use('/budget',budgetRouter);

export default router;