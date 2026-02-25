import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    mobileno: String,
    password: String,
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);