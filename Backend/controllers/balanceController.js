import transactionModel from "../models/transactionModel.js";
import mongoose from "mongoose";

export const fetchBalance = async (req, res) => {
    try {
        console.log("fetch balance api called", req.params);
        const { userId } = req.params;

        // Calculate the balance dynamically from the transactions collection!
        const summary = await transactionModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    isDeleted: false // Don't count deleted transactions
                }
            },
            {
                $group: {
                    _id: "$type", // Group by 'income' and 'expense'
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        console.log("Aggregation summary result:", summary);
        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach(item => {
            if (item._id === 'income') totalIncome = item.totalAmount;
            if (item._id === 'expense') totalExpense = item.totalAmount;
        });
        
        console.log("Aggregation summary result:", totalIncome, totalExpense);
        
        // The true, mathematically accurate balance
        const calculatedBalance = totalIncome - totalExpense;

        console.log("Dynamically Calculated Balance:", calculatedBalance);

        // Return it in the same format your frontend expects
        res.status(200).json({ totalBalance: calculatedBalance });

    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: error.message });
    }
}