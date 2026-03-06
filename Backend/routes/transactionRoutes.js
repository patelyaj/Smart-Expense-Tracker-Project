import express from "express";
import { addTransaction, deleteTransaction, editTransaction, exportTransactionsCsv, fetchIncomeExpense, fetchTransactions } from "../controllers/transactionController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { fetchExpenseByCategory } from "../controllers/transactionController.js";

const router = express.Router();
router.get('/exportcsv/:id', verifyToken,exportTransactionsCsv);
router.get('/fetchtransactions/:id',verifyToken ,fetchTransactions);
router.post('/addtransaction',verifyToken,addTransaction);
router.patch('/edittransaction/:id',verifyToken,editTransaction);
router.delete('/deletetransaction/:id',verifyToken,deleteTransaction);
router.get('/fetchincomeexpense/:id',verifyToken,fetchIncomeExpense);
router.get('/fetchexpensebycategory/:id',verifyToken ,fetchExpenseByCategory);

export default router;