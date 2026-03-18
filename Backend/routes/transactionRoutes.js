import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { addTransaction, deleteTransaction, editTransaction, exportTransactionsCsv, fetchTransactions , fetchDashboardSummary } from "../controller/transactionController.js";

const router = express.Router();

// can be merged i think 
router.get('/',verifyToken ,fetchTransactions);

//  merged for both on dashboard
// router.get('/balance-income-expense',verifyToken,fetchIncomeExpense); 
// router.get('/fetchexpensebycategory/:id',verifyToken ,fetchExpenseByCategory);

//////////////////  sure separate api needed
// get transaction csv of a user
router.get('/export-csv', verifyToken,exportTransactionsCsv);
// add
router.post('/',verifyToken,addTransaction);
// edit
router.patch('/:id',verifyToken,editTransaction);
//delete
router.delete('/:id',verifyToken,deleteTransaction);

export default router;