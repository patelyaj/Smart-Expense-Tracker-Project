import transactionModel from "../model/transactionModel.js";
import mongoose from "mongoose";
import categoryModel from "../model/categoryModel.js";

export const exportTransactionsCsv = async (req, res) => {
    console.log("export transactions csv api called");
    try {
        const userId = req.user.userId;
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

        // Define CSV Headers
        const csvHeaders = ['Date', 'Title', 'Amount', 'Type', 'Category', 'Description'];

        // Map transactions to CSV rows
        const csvRows = transactions.map(txn => {
            const date = new Date(txn.date).toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
            
            // Wrap text fields in quotes to prevent commas inside the text from breaking the CSV columns
            const title = `"${(txn.title || '').replace(/"/g, '""')}"`;
            const amount = txn.amount;
            const type = txn.type;
            const category = `"${(txn.category?.name || 'Uncategorized').replace(/"/g, '""')}"`;
            const description = `"${(txn.description || '').replace(/"/g, '""')}"`;

            return [date, title, amount, type, category, description].join(',');
        });

        // Combine headers and rows
        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

        console.log(`Exported ${transactions.length} transactions to CSV.`);

        // Send as a downloadable file
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
        res.status(200).send(csvContent);

    } catch (err) {
        console.error("Error exporting CSV:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// fetch transaction 

export const fetchTransactions = async (req, res) => {
    try {
        console.log("fetching transactions..");
        const userId = req.user.userId;
        
        // 1. Get filters from query params
        const { startDate, endDate, page = 1, limit = 10, search = "", category = "all" } = req.query; 
        
        let query = { userId, isDeleted: false };

        // 2. Date Range Filter
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // 3. Search Filter (Title or Description)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // 4. Category Filter
        if (category !== "all") {
            const categoryDoc = await categoryModel.findOne({ name: category, userId });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            } else {
                return res.status(200).json({ transactions: [], totalPages: 0, currentPage: Number(page) });
            }
        }

        const skip = (Number(page) - 1) * Number(limit);
        
        // 5. Count Documents
        const totalTransactions = await transactionModel.countDocuments(query);
        const totalPages = Math.ceil(totalTransactions / Number(limit));

        // 6. Fetch and Sort (Date descending, then Newest Added internally)
        const transactions = await transactionModel
            .find(query)
            .populate('category', 'name type')
            .sort({ date: -1, _id: -1 }) 
            .skip(skip)
            .limit(Number(limit))
            .lean(); 

        res.status(200).json({ transactions, totalPages, currentPage: Number(page) });
    } catch(err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const addTransaction = async (req, res) => {
    console.log("add transaction api called",req.body);
    try {
        const {userId, title,amount, type, category, date, description} = req.body;
        
        if(!userId || !amount || !type || !category || !date || !title) {
            return res.status(400).json({message:"Missing required fields"});
        }

        // category lean
        let categoryDoc = await categoryModel.findOne({ name: category, userId }).lean();
        if (!categoryDoc) {
            categoryDoc = await categoryModel.create({ name: category, type, userId });
        }
        console.log("categoryDoc when adding trasnsaction . ihace to see id it returns",categoryDoc);

        const newTransaction = new transactionModel({
            userId,
            amount,
            title,
            type,
            category: categoryDoc._id,
            date,
            description
        });
        await newTransaction.save();
        
        await newTransaction.populate('category', 'name type');

        console.log("Transaction added to DB finished ", newTransaction);

        res.status(201).json({message:"Transaction added successfully", transaction: newTransaction});
    } catch(err) {
        console.error(err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const editTransaction = async (req, res) => {
    console.log("edit transaction api called",req.body);
    try {
        const transactionId = req.params.id;
        console.log("===================transactionId when editing trasnsaction --- ",transactionId);
        const userId = req.user.userId;
        const {amount, type, category, date, description, title} = req.body;

        // category lean
        let categoryDoc = await categoryModel.findOne({ name: category, userId }).lean();
        if (!categoryDoc) {
            categoryDoc = await categoryModel.create({ name: category, type, userId });
        }

        console.log("categoryDoc when editing trasnsaction . ihace to see id it returns",categoryDoc);

        // lean
        const edited = await transactionModel.findByIdAndUpdate(
            transactionId, 
            { 
                amount, 
                type, 
                category: categoryDoc._id, 
                date, 
                description, 
                title 
            }, 
            { new: true }
        ).populate('category', 'name type').lean();

        if(!edited) return res.status(404).json({message:"Transaction not found"});

        console.log("Transaction edited in DB finished ", edited);
        
        res.status(200).json({message:"Transaction updated successfully", transaction: edited});
    } catch(err) {
        res.status(500).json({message:"Internal server error"});
    }
}

// delete 
export const deleteTransaction = async (req, res) => {
    console.log("delete transaction api called",req.params);
  try {
    const  transactionId  = req.params.id;
    const userId = req.user.userId;
    // lean
    const deleted = await transactionModel.findByIdAndUpdate(
      { _id: transactionId, userId: userId },
      { isDeleted: true },
      { new: true }
    ).lean();

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    console.log("Transaction soft deleted in DB finished ", deleted);

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
// export const fetchIncomeExpense = async (req, res) => {
//     console.log("fetch income expense api called");
//     console.log("req.params", req.params.id);
//     console.log("req.query", req.user.userId);
//     try {
//         const userId = req.params.id;
//         console.log(userId,"u");
//         const { startDate, endDate } = req.query;
//         console.log("check", startDate, "done", endDate);

//         const matchStage = {
//             // CRITICAL: aggregate() requires manual casting to ObjectId
//             userId: new mongoose.Types.ObjectId(userId), 
            
//             // Respecting your schema's soft-delete feature!
//             isDeleted: false 
//         };

//         if (startDate && endDate) {
//             matchStage.date = {
//                 $gte: new Date(startDate),
//                 $lte: new Date(endDate)
//             };
//         }

//         // 3. Execute the Aggregation Pipeline
//         const summary = await transactionModel.aggregate([
//             { 
//                 $match: matchStage 
//             },
//             { 
//                 $group: {
//                     _id: "$type", // Groups by the 'enum' in your schema ('income' or 'expense')
//                     totalAmount: { $sum: "$amount" } // Sums up the 'amount' field
//                 }
//             }
//         ]);

//         console.log("Aggregation summary result:", summary);

//         let income = 0;
//         let expense = 0;

//         // summary will look like: [ { _id: 'income', totalAmount: 5000 }, { _id: 'expense', totalAmount: 200 } ]
//         summary.forEach(item => {
//             if (item._id == 'income') income = item.totalAmount;
//             if (item._id == 'expense') expense = item.totalAmount;
//         });

//         console.log("fetch income expense finished Calculated Income and Expense:", { income, expense });
//         console.log("Income:", income, "Expense:", expense);

//         res.status(200).json({ 
//             income, 
//             expense, 
//             netBalance: income - expense 
//         });

//     } catch (err) {
//         console.error("Error getting transaction summary:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// //////////////
// export const fetchExpenseByCategory = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { startDate, endDate } = req.query;

//         const matchStage = {
//             userId: new mongoose.Types.ObjectId(userId),
//             type: "expense",
//             isDeleted: false
//         };

//         if (startDate && endDate) {
//             matchStage.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//         }

//         const categoryData = await transactionModel.aggregate([
//             { $match: matchStage }, // 1. Find only expenses for this user in this date range
//             { $group: { _id: "$category", amount: { $sum: "$amount" } } }, // 2. Group by category ID and sum amounts
//             { $lookup: { // 3. Join with Category collection to get the actual category name
//                 from: "categories", 
//                 localField: "_id", 
//                 foreignField: "_id", 
//                 as: "categoryDoc" 
//             }},
//             { $unwind: "$categoryDoc" }, // 4. Flatten the array from lookup
//             { $project: { // 5. Format exactly how Recharts wants it!
//                 _id: 0,
//                 name: "$categoryDoc.name",
//                 amount: 1
//             }},
//             { $sort: { amount: -1 } } // 6. Sort highest expense to lowest
//         ]);

//         res.status(200).json(categoryData);
//     } catch (err) {
//         console.error("Error fetching category chart data:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// merged api for dashboard 
export const fetchDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        // Base match stage for both queries
        const matchStageBase = {
            userId: new mongoose.Types.ObjectId(userId), 
            isDeleted: false 
        };

        if (startDate && endDate) {
            matchStageBase.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // 1. Prepare Income/Expense Aggregation
        const incomeExpenseQuery = transactionModel.aggregate([
            { $match: matchStageBase },
            { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } }
        ]);

        // 2. Prepare Category Aggregation (Notice we just add type: "expense" to the base match)
        const categoryQuery = transactionModel.aggregate([
            // the matchstage is same we jut have to add type so we used destructer 
            { $match: { ...matchStageBase, type: "expense" } },
            { $group: { _id: "$category", amount: { $sum: "$amount" } } },
            { $lookup: { 
                from: "categories", 
                localField: "_id", 
                foreignField: "_id", 
                as: "categoryDoc" 
            }},
            { $unwind: "$categoryDoc" },
            { $project: { _id: 0, name: "$categoryDoc.name", amount: 1 } },
            { $sort: { amount: -1 } }
        ]);

        // 3. RUN BOTH IN PARALLEL 🚀
        const [summary, categoryData] = await Promise.all([
            incomeExpenseQuery, 
            categoryQuery
        ]);

        // 4. Format the Income/Expense numbers
        let income = 0;
        let expense = 0;

        summary.forEach(item => {
            if (item._id === 'income') income = item.totalAmount;
            if (item._id === 'expense') expense = item.totalAmount;
        });

        // 5. Send one beautifully packaged response to the frontend
        res.status(200).json({ 
            income, 
            expense, 
            netBalance: income - expense,
            expenseByCategory: categoryData // <-- Chart data is right here!
        });

    } catch (err) {
        console.error("Error fetching dashboard summary:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};