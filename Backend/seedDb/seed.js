// Backend/seed.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Balance from "../models/balanceModel.js";
import Category from "../models/categoryModel.js";
import Transaction from "../models/transactionModel.js";
import Budget from "../models/budgetModel.js";
import { defaultCategoriesList } from "../utils/defaultCategories.js";
import { configDotenv } from "dotenv";

configDotenv(); // Load environment variables from .env file

// Make sure this path points to the utils file we created earlier!

// --- CONFIGURATION ---
// Replace with your MongoDB connection string if not using process.env
const MONGO_URI = process.env.MONGO_URI || ""; 
if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables!");
    process.exit(1);
}
console.log("Mongo URI from env:", MONGO_URI);

// Helper functions for dynamic data generation
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedDatabase = async () => {
  try {
    console.log("⏳ Connecting to Database...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database Connected!");

    // 1. CLEAR EXISTING DATA (Be careful running this in production!)
    console.log("🧹 Clearing old data...");
    await User.deleteMany({});
    await Balance.deleteMany({});
    await Category.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    // 2. CREATE A DUMMY USER
    console.log("👤 Creating dummy user...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt); // Password is: password123

    const dummyUser = await User.create({
      username: "JohnDoe",
      email: "john@example.com",
      mobileno: "1234567890",
      password: hashedPassword,
      theme: "light",
    });

    // 3. CREATE CATEGORIES
    console.log("📁 Creating categories...");
    const categoriesWithUserId = defaultCategoriesList.map(cat => ({
      ...cat,
      userId: dummyUser._id,
    }));
    const savedCategories = await Category.insertMany(categoriesWithUserId);

    // Separate categories by type for easier transaction generation
    const incomeCategories = savedCategories.filter(c => c.type === "income");
    const expenseCategories = savedCategories.filter(c => c.type === "expense");

    // 4. GENERATE DYNAMIC TRANSACTIONS
    console.log("💸 Generating realistic transactions...");
    const transactions = [];
    let calculatedBalance = 0;

    const descriptions = {
        "Food & Dining": ["McDonalds", "Starbucks", "Dinner at Olive Garden", "Lunch with client"],
        "Groceries": ["Walmart", "Whole Foods", "Local Market"],
        "Transportation": ["Uber", "Gas Station", "Subway ticket", "Car wash"],
        "Salary": ["Monthly Salary", "Bonus"],
        "Freelance": ["Upwork Project", "Website design client"],
    };

    // Generate 40 random transactions over the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    for (let i = 0; i < 40; i++) {
      const isExpense = Math.random() > 0.2; // 80% chance of expense, 20% income
      const type = isExpense ? "expense" : "income";
      const category = isExpense ? getRandomElement(expenseCategories) : getRandomElement(incomeCategories);
      
      // Expenses between $5-$200, Incomes between $500-$3000
      const amount = isExpense ? getRandomInt(5, 200) : getRandomInt(500, 3000); 
      
      const defaultDesc = isExpense ? "General Expense" : "General Income";
      const descList = descriptions[category.name] || [defaultDesc];

      const transaction = {
        userId: dummyUser._id,
        amount: amount,
        type: type,
        category: category._id,
        date: getRandomDate(ninetyDaysAgo, new Date()), // Random date in last 90 days
        description: getRandomElement(descList),
      };

      transactions.push(transaction);

      // Keep track of total balance accurately!
      if (type === "income") {
        calculatedBalance += amount;
      } else {
        calculatedBalance -= amount;
      }
    }

    await Transaction.insertMany(transactions);

    // 5. CREATE BALANCE BASED ON GENERATED TRANSACTIONS
    console.log(`🏦 Setting final balance to: $${calculatedBalance}`);
    await Balance.create({
      userId: dummyUser._id,
      totalBalance: calculatedBalance,
    });

    // 6. CREATE A REALISTIC BUDGET
    console.log("📊 Setting up a budget...");
    const foodCategory = expenseCategories.find(c => c.name === "Food & Dining");
    
    // Create a budget from the 1st of the current month to the end of the month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (foodCategory) {
        await Budget.create({
            userId: dummyUser._id,
            category: foodCategory._id,
            limit: 500, // $500 limit on food
            period: "monthly",
            startDate: startOfMonth,
            endDate: endOfMonth
        });
    }

    console.log("🎉 Database Successfully Seeded!");
    process.exit();
    
  } catch (error) {
    console.error("❌ Seeding Error: ", error);
    process.exit(1);
  }
};

seedDatabase();