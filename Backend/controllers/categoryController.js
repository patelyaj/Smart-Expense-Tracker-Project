import Category from "../models/categoryModel.js";

export const fetchCategories = async (req, res) => {
    try {
        // Grab userId from the verified token (best practice) or params
        const userId = req.user.userId; 
        
        // by default id is fetched we dont want id so -_id is written 
        const categories = await Category.find({ userId }).select('name type -_id').lean();
        
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};