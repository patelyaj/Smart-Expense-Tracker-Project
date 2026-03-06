import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type : mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

transactionSchema.index({
  userId: 1,
  category: 1,
  date: -1,
  type: 1,
  isDeleted: 1
});
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, isDeleted: 1 });

export default mongoose.model("Transaction", transactionSchema);