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

configDotenv();

// ------------------ CONFIG ------------------

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables!");
  process.exit(1);
}

// ------------------ HELPERS ------------------

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

// Realistic Dummy Titles for random expenses
const expenseTitles = [
  "Grocery Shopping at Walmart", "Uber Ride to Downtown", "Starbucks Coffee", 
  "Amazon Prime Order", "Netflix Subscription", "Electricity Bill", 
  "Dinner at Olive Garden", "Movie Theater Tickets", "Monthly Gym Membership", 
  "Pharmacy Run", "Books from Barnes & Noble", "Office Supplies", "Gas Station Fill-up"
];

const freelanceTitles = [
  "Upwork Client Payment", "Fiverr Web Design Gig", "Consulting Fee", "Logo Design Project"
];

const seedDatabase = async () => {
  try {
    console.log("⏳ Connecting to Database...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database Connected!");

    // ------------------ CLEAR OLD DATA ------------------
    console.log("🧹 Clearing old data...");
    await User.deleteMany({});
    await Balance.deleteMany({});
    await Category.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    // ------------------ CREATE USER ------------------
    console.log("👤 Creating dummy user...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const dummyUser = await User.create({
      username: "JohnDoe",
      email: "john@example.com",
      mobileno: "1234567890",
      password: hashedPassword,
      theme: "light",
    });

    // ------------------ CREATE CATEGORIES ------------------
    console.log("📁 Creating categories...");
    const categoriesWithUserId = defaultCategoriesList.map((cat) => ({
      ...cat,
      userId: dummyUser._id,
    }));

    const savedCategories = await Category.insertMany(
      categoriesWithUserId
    );

    const incomeCategories = savedCategories.filter(
      (c) => c.type === "income"
    );

    const expenseCategories = savedCategories.filter(
      (c) => c.type === "expense"
    );

    // ------------------ DATE RANGE ------------------
    const startDate = new Date("2026-02-01T00:00:00.000Z");
    const endDate = new Date();

    // ------------------ GENERATE TRANSACTIONS ------------------
    console.log("💸 Generating realistic transactions from Feb 1, 2026 → Today...");

    const transactions = [];
    let calculatedBalance = 0;

    // Create month list
    const months = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    for (let monthDate of months) {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      // 1️⃣ Monthly Salary (1st)
      const salaryCategory = incomeCategories.find((c) =>
        c.name.toLowerCase().includes("salary")
      );

      if (salaryCategory) {
        const salaryAmount = getRandomInt(2500, 5000);

        transactions.push({
          userId: dummyUser._id,
          title: "Tech Corp Monthly Salary", // 👈 ADDED TITLE
          amount: salaryAmount,
          type: "income",
          category: salaryCategory._id,
          date: new Date(year, month, 1),
          description: "Monthly Salary",
        });

        calculatedBalance += salaryAmount;
      }

      // 2️⃣ Monthly Rent (5th)
      const rentCategory = expenseCategories.find((c) =>
        c.name.toLowerCase().includes("rent")
      );

      if (rentCategory) {
        const rentAmount = getRandomInt(800, 1500);

        transactions.push({
          userId: dummyUser._id,
          title: "Downtown Apartment Rent", // 👈 ADDED TITLE
          amount: rentAmount,
          type: "expense",
          category: rentCategory._id,
          date: new Date(year, month, 5),
          description: "Monthly Rent",
        });

        calculatedBalance -= rentAmount;
      }

      // 3️⃣ Random Daily Expenses (10–20 per month)
      const randomExpenseCount = getRandomInt(10, 20);

      for (let i = 0; i < randomExpenseCount; i++) {
        const randomCategory = getRandomElement(expenseCategories);
        const amount = getRandomInt(10, 300);
        const randomDay = getRandomInt(1, 28);

        const transactionDate = new Date(year, month, randomDay);

        if (transactionDate > endDate) continue;

        transactions.push({
          userId: dummyUser._id,
          title: getRandomElement(expenseTitles), // 👈 ADDED RANDOM TITLE
          amount,
          type: "expense",
          category: randomCategory._id,
          date: transactionDate,
          description: "Daily Expense",
        });

        calculatedBalance -= amount;
      }

      // 4️⃣ Occasional Freelance Income (random months)
      if (Math.random() > 0.6) {
        const freelanceCategory = incomeCategories.find((c) =>
          c.name.toLowerCase().includes("freelance")
        );

        if (freelanceCategory) {
          const freelanceAmount = getRandomInt(500, 2000);

          transactions.push({
            userId: dummyUser._id,
            title: getRandomElement(freelanceTitles), // 👈 ADDED RANDOM TITLE
            amount: freelanceAmount,
            type: "income",
            category: freelanceCategory._id,
            date: new Date(year, month, getRandomInt(10, 25)),
            description: "Freelance Project",
          });

          calculatedBalance += freelanceAmount;
        }
      }
    }

    await Transaction.insertMany(transactions);

    console.log(`📦 Inserted ${transactions.length} transactions`);
    console.log(`🏦 Final Calculated Balance: $${calculatedBalance}`);

    // ------------------ CREATE BALANCE ------------------
    await Balance.create({
      userId: dummyUser._id,
      totalBalance: calculatedBalance,
    });

    // ------------------ CREATE MONTHLY BUDGETS ------------------
    console.log("📊 Creating monthly budgets...");

    const startOfCurrentMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      1
    );

    const endOfCurrentMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      0
    );

    for (let category of expenseCategories) {
      await Budget.create({
        userId: dummyUser._id,
        category: category._id,
        limit: getRandomInt(300, 1500),
        period: "monthly",
        startDate: startOfCurrentMonth,
        endDate: endOfCurrentMonth,
      });
    }

    console.log("🎉 Database Successfully Seeded!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();