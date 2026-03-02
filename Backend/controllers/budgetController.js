import budgetModel from "../models/budgetModel";

export const fetchBudget = async (req, res) => {
    try {
        console.log("fetch budget api called",req.params);
        const { userId }= req.params;    
        console.log("userId",userId);
        const budget = await budgetModel.findOne({ userId });

        console.log("budget",budget);   
        if (!budget) {
            return res.status(404).json({ error: "Budget record not found for user" });
        }
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createBudget = async (req, res) => {
    try {
        const { userId,limit,category,period,startDate,endDate} = req.body;

        const newbudget = await budgetModel.insertOne(
            userId,
            limit,
            category,
            period,
            startDate,
            endDate
        )

        await newbudget.save();
        return res.status(200).json(newbudget);
    } catch (error) {
        res.status(500).json({error : "error creating budget"});
    }
}

export const updateBudget = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit, category, period, startDate, endDate } = req.body;
        const updatedBudget = await budgetModel.updateOne(
            { userId },
            {
                $set: {
                    limit,
                    category,
                    period,
                    startDate,
                    endDate
                }
            }
        );
        if (!updatedBudget) {
            return res.status(404).json({ error: "Budget record not found for user" });
        }
        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteBudget = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedBudget = await budgetModel.deleteOne({ userId });
        if (!deletedBudget) {
            return res.status(404).json({ error: "Budget record not found for user" });
        }
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}