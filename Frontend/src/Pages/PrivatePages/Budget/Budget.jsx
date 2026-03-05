import React, { useEffect, useState } from "react";
import Navbar from "../../../Component/DashboardComponents/Navbar";
import {
  Box, Container, Typography, Paper, TextField, MenuItem, Button, Stack
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchBudgetProgress, createBudget } from "../../../redux/Features/budgetSlice";
import { fetchCategories } from "../../../redux/Features/categorySlice"; 
import dayjs from "dayjs";

function Budget() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  const progressBudgets = useSelector((state) => state.budget?.progressBudgets) || [];
  
  // GET CATEGORIES FROM REDUX
  const { categories } = useSelector((state) => state.category);

  const [category, setCategory] = useState("overall");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    if (userId) {
      dispatch(fetchBudgetProgress(userId));
      dispatch(fetchCategories()); // Fetch categories on load
    }
  }, [dispatch, userId]);

  // Filter categories to only show expense categories
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleCreateBudget = () => {
    const now = dayjs();
    let startDate;
    let endDate;

    if (period === "monthly") {
      startDate = now.startOf("month").toISOString();
      endDate = now.endOf("month").toISOString();
    }
    if (period === "weekly") {
      startDate = now.startOf("week").toISOString();
      endDate = now.endOf("week").toISOString();
    }
    if (period === "yearly") {
      startDate = now.startOf("year").toISOString();
      endDate = now.endOf("year").toISOString();
    }

    dispatch(createBudget({
      userId,
      category: category === "overall" ? null : category, 
      limit: Number(limit),
      period,
      startDate,
      endDate
    })).then(() => {
         dispatch(fetchBudgetProgress(userId));
         setLimit(""); // Reset form
    });
  };

  return (
    <>
    {/* FIX 1: Use background.default from theme instead of hardcoded hex */}
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        
        {/* FIX 2: Explicitly use text.primary for main headings */}
        <Typography variant="h4" fontWeight={800} sx={{ mb: 4, color: "text.primary" }}>
          Budgets
        </Typography>

        {/* CREATE BUDGET */}
        {/* FIX 3: Use background.paper for Paper components and theme divider for border */}
        <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            mb: 4, 
            border: "1px solid", 
            borderColor: "divider", 
            bgcolor: "background.paper" 
        }}>
          <Typography fontWeight={700} sx={{ mb: 2, color: "text.primary" }}>
            Create Budget
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="overall">Overall Budget</MenuItem>
              {expenseCategories.map((cat) => (
                  <MenuItem key={cat._id || cat.name} value={cat.name}>
                     {cat.name}
                  </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Budget Limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              />

            <TextField
              select
              label="Period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{ width: 200 }}
              >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>

            <Button variant="contained" onClick={handleCreateBudget} disabled={!limit}>
              Create
            </Button>
          </Stack>
        </Paper>

        {/* BUDGET LIST */}
        {progressBudgets.map((budget) => (
            <Paper
            key={budget._id}
            sx={{
                p: 3, 
                mb: 2, 
                borderRadius: 3, 
                border: "1px solid", 
                borderColor: "divider", // Theme aware border
                bgcolor: "background.paper", // Theme aware background
                cursor: "pointer",
                "&:hover": {
                    opacity: 0.9 // Little hover effect
                }
            }}
            onClick={() => navigate(`/budget/${budget._id}`)}
            >
            <Typography fontWeight={700} color="text.primary">
              {budget.category?.name || "Overall Budget"}
            </Typography>
            
            {/* FIX 4: Use text.secondary for subtle text details */}
            <Typography color="text.secondary">Limit: ${budget.limit}</Typography>
            <Typography color="text.secondary">Spent: ${budget.spent}</Typography>
          </Paper>
        ))}
      </Container>
    </Box>
    </>
  );
}

export default Budget;