import budgetModel from "../models/budgetModel.js";
import transactionModel from "../models/transactionModel.js";


// Fetch all budgets
export const fetchBudget = async (req, res) => {

  try {

    const { userId } = req.params;

    const budgets = await budgetModel
      .find({ userId })
      .populate("category", "name");

    res.status(200).json(budgets);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// Create budget
export const createBudget = async (req, res) => {

  try {

    const { userId, limit, category, period, startDate, endDate } = req.body;

    const newBudget = new budgetModel({
      userId,
      limit,
      category: category || null,
      period,
      startDate,
      endDate
    });

    await newBudget.save();

    res.status(201).json({
      message: "Budget created successfully",
      budget: newBudget
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// Update budget
export const updateBudget = async (req, res) => {

  try {

    const { budgetId } = req.params;

    const updatedBudget = await budgetModel.findByIdAndUpdate(
      budgetId,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBudget);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// Delete budget
export const deleteBudget = async (req, res) => {

  try {

    const { budgetId } = req.params;

    await budgetModel.findByIdAndDelete(budgetId);

    res.status(200).json({
      message: "Budget deleted successfully",
      budgetId
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// Fetch budget progress
export const fetchBudgetProgress = async (req, res) => {

  try {

    const { userId } = req.params;

    const budgets = await budgetModel
      .find({ userId })
      .populate("category", "name");

    const result = [];

    for (const budget of budgets) {

      const match = {
        userId: budget.userId,
        type: "expense",
        isDeleted: false,
        date: {
          $gte: budget.startDate,
          $lte: budget.endDate
        }
      };

      if (budget.category) {
        match.category = budget.category._id;
      }

      const spent = await transactionModel.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);

      result.push({
        ...budget.toObject(),
        spent: spent[0]?.total || 0
      });

    }

    res.status(200).json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const getBudgetDetails = async (req, res) => {

  const { budgetId } = req.params;

  const budget = await budgetModel.findById(budgetId).populate("category");

  const spent = await transactionModel.aggregate([
    {
      $match: {
        userId: budget.userId,
        category: budget.category,
        type: "expense",
        isDeleted: false,
        date: { $gte: budget.startDate, $lte: budget.endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);

  const spentAmount = spent[0]?.total || 0;

  const remaining = budget.limit - spentAmount;

  const daysLeft =
    (new Date(budget.endDate) - new Date()) / (1000 * 60 * 60 * 24);

  const dailyAllowed = remaining / Math.max(daysLeft, 1);

  res.json({
    budget,
    spent: spentAmount,
    remaining,
    dailyAllowed
  });

};