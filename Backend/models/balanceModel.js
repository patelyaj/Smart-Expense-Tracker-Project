import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalBalance: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Balance", balanceSchema);