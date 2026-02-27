import express from "express";
import { addTransaction, deleteTransaction, fetchTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.get('/fetchtransactions/:id',fetchTransactions);
router.post('/addtransaction',addTransaction);
router.patch('/edittransaction/:id',addTransaction);
router.delete('/deletetransaction/:id',deleteTransaction);


export default router;