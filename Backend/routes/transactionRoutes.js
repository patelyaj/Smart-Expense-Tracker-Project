import express from "express";
import { addTransaction, deleteTransaction, fetchIncomeExpense, fetchTransactions } from "../controllers/transactionController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/fetchtransactions/:id',verifyToken ,fetchTransactions);
router.post('/addtransaction',verifyToken,addTransaction);
router.patch('/edittransaction/:id',verifyToken,addTransaction);
router.delete('/deletetransaction/:id',verifyToken,deleteTransaction);
router.get('/fetchincomeexpense',verifyToken,fetchIncomeExpense);

export default router;