import budgetModel from "../models/budgetModel.js";
import transactionModel from "../models/transactionModel.js";
// Add this import at the top of the file if it's not there
import categoryModel from "../models/categoryModel.js";

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

    let categoryId = null;

    // Look up category ObjectId if a specific category was provided (not "overall")
    if (category && category !== "overall") {
       let categoryDoc = await categoryModel.findOne({ name: category, userId });
       
       // If category doesn't exist, you might want to create it, 
       // or reject the request. We'll create it to be safe.
       if (!categoryDoc) {
            categoryDoc = await categoryModel.create({ name: category, type: 'expense', userId });
       }
       categoryId = categoryDoc._id;
    }

    const newBudget = new budgetModel({
      userId,
      limit,
      category: categoryId, // Save the ObjectId or null
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
    console.error("Error creating budget:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update budget
export const updateBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { category, userId, ...updateData } = req.body;

    let updatePayload = { ...updateData };

    // If category is being updated, handle the ObjectId lookup
    if (category !== undefined) {
         if (category && category !== "overall") {
            let categoryDoc = await categoryModel.findOne({ name: category, userId });
            if (!categoryDoc) {
                 categoryDoc = await categoryModel.create({ name: category, type: 'expense', userId });
            }
            updatePayload.category = categoryDoc._id;
         } else {
            updatePayload.category = null; // Set to null for "overall"
         }
    }

    const updatedBudget = await budgetModel.findByIdAndUpdate(
      budgetId,
      updatePayload,
      { new: true }
    ).populate("category", "name");

    res.status(200).json(updatedBudget);

  } catch (error) {
    console.error("Error updating budget:", error);
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
  try {
    const { budgetId } = req.params;

    const budget = await budgetModel.findById(budgetId).populate("category");

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // 1. Build the match stage dynamically
    const matchStage = {
      userId: budget.userId,
      type: "expense",
      isDeleted: false,
      date: { $gte: budget.startDate, $lte: budget.endDate }
    };

    // 2. Only add category to the filter if it's a specific category budget
    if (budget.category) {
      matchStage.category = budget.category._id; // MUST use ._id here!
    }

    // 3. Run the aggregation
    const spent = await transactionModel.aggregate([
      { $match: matchStage },
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
    
  } catch (error) {
    console.error("Error in getBudgetDetails:", error);
    res.status(500).json({ error: error.message });
  }
};