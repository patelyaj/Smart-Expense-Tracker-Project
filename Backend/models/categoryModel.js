import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    // icon: { type: String, default: 'category' },
    type: { type: String, enum: ['income', 'expense'], required: true },
    isStandard: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);