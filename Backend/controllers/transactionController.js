import transactionModel from "../models/transactionModel.js";
import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";

export const fetchTransactions = async (req, res) => {
    try {
        const userId = req.params.id;
        const { startDate, endDate } = req.query; 
        
        let query = { userId, isDeleted: false };
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const transactions = await transactionModel
            .find(query)
            .populate('category', 'name type')
            .sort({ date: -1 })
            .lean(); 

        res.status(200).json(transactions);
    } catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

export const addTransaction = async (req, res) => {
    try {
        const {userId, amount, type, category, date, description} = req.body;
        
        if(!userId || !amount || !type || !category || !date){
            return res.status(400).json({message:"Missing required fields"});
        }

        let categoryDoc = await categoryModel.findOne({ name: category, userId });
        if (!categoryDoc) {
            categoryDoc = await categoryModel.create({ name: category, type, userId });
        }
        console.log("categoryDoc when adding trasnsaction . ihace to see id it returns",categoryDoc);

        const newTransaction = new transactionModel({
            userId,
            amount,
            type,
            category: categoryDoc._id,
            date,
            description
        });
        await newTransaction.save();
        
        await newTransaction.populate('category', 'name type');

        res.status(201).json({message:"Transaction added successfully", transaction: newTransaction});
    } catch(err) {
        console.error(err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const editTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const {amount, type, category, date, description} = req.body;

        let categoryDoc = await categoryModel.findOne({ name: category, userId: req.user.userId });
        if (!categoryDoc) {
            categoryDoc = await categoryModel.create({ name: category, type, userId: req.user.userId });
        }

        const edited = await transactionModel.findByIdAndUpdate(transactionId, {
            amount, type, category: categoryDoc._id, date, description
        }, {new: true}).populate('category', 'name type');

        if(!edited) return res.status(404).json({message:"Transaction not found"});
        
        res.status(200).json({message:"Transaction updated successfully", transaction: edited});
    } catch(err) {
        res.status(500).json({message:"Internal server error"});
    }
}

// delete 
export const deleteTransaction = async (req, res) => {
  try {
    const  transactionId  = req.params.id;

    const deleted = await transactionModel.findByIdAndUpdate(
      transactionId,
      { isDeleted: true },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction soft deleted successfully",
      transactionId
    });

  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// income expense
export const fetchIncomeExpense = async (req, res) => {
    console.log("hi");
    try {
        const userId = req.user.userId;
        console.log(userId,"u");
        const { startDate, endDate } = req.query;
        console.log(startDate,"done",endDate);

        const matchStage = {
            // CRITICAL: aggregate() requires manual casting to ObjectId
            userId: new mongoose.Types.ObjectId(userId), 
            
            // Respecting your schema's soft-delete feature!
            isDeleted: false 
        };

        if (startDate && endDate) {
            matchStage.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // 3. Execute the Aggregation Pipeline
        const summary = await transactionModel.aggregate([
            { 
                $match: matchStage 
            },
            { 
                $group: {
                    _id: "$type", // Groups by the 'enum' in your schema ('income' or 'expense')
                    totalAmount: { $sum: "$amount" } // Sums up the 'amount' field
                }
            }
        ]);

        let income = 0;
        let expense = 0;

        // summary will look like: [ { _id: 'income', totalAmount: 5000 }, { _id: 'expense', totalAmount: 200 } ]
        summary.forEach(item => {
            if (item._id == 'income') income = item.totalAmount;
            if (item._id == 'expense') expense = item.totalAmount;
        });

        console.log("Income:", income, "Expense:", expense);

        res.status(200).json({ 
            income, 
            expense, 
            netBalance: income - expense 
        });

    } catch (err) {
        console.error("Error getting transaction summary:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};