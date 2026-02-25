import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  category: {
    type: String,
    required: true
  },

  limit: {
    type: Number,
    required: true
  },

  period: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  }

}, { timestamps: true });

budgetSchema.index(
  { userId: 1, category: 1, period: 1, startDate: 1 },
  { unique: true }
);

export default mongoose.model("Budget", budgetSchema);