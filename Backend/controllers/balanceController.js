import balanceModel from "../models/balanceModel.js";

export const fetchBalance = async (req, res) => {
    try {
        console.log("fetch balance api called",req.params);
        const { userId }= req.params;    
        console.log("userId",userId);
        const balance = await balanceModel.findOne({ userId });

        console.log("balance",balance);
        if (!balance) {
            return res.status(404).json({ error: "Balance record not found for user" });
        }
        res.status(200).json(balance);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}