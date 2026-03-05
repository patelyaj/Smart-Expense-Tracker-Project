import React, { useEffect, useState } from "react";
import Navbar from "../../../Component/DashboardComponents/Navbar";
import {
  Box, Container, Typography, Paper, TextField, MenuItem, Button, Stack,
  Grid, LinearProgress, Chip
} from "@mui/material";
import { alpha } from "@mui/material/styles";
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

  // Helper function to determine progress bar color
  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "error";    // Over budget (Red)
    if (percentage >= 85) return "warning";   // Near limit (Orange)
    return "primary";                         // Safe (Blue/Primary)
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        
        <Typography variant="h4" fontWeight={800} sx={{ mb: 4, color: "text.primary" }}>
          Budgets
        </Typography>

        {/* CREATE BUDGET FORM */}
        <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 4 }, // Responsive padding for better spacing
            borderRadius: 3, 
            mb: 6, 
            border: "1px solid", 
            borderColor: "divider", 
            bgcolor: "background.paper" 
        }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "text.primary" }}>
            Create New Budget
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 200, flexGrow: 1 }}
              size="small"
            >
              <MenuItem value="overall">Overall Budget</MenuItem>
              {expenseCategories.map((cat) => (
                  <MenuItem key={cat._id || cat.name} value={cat.name}>
                     {cat.name}
                  </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Budget Limit (₹)"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              size="small"
              sx={{ minWidth: 150, flexGrow: 1 }}
            />

            <TextField
              select
              label="Period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{ minWidth: 150, flexGrow: 1 }}
              size="small"
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>

            <Button 
              variant="contained" 
              onClick={handleCreateBudget} 
              disabled={!limit}
              sx={{ px: 4, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600, minHeight: '40px' }}
              disableElevation
            >
              Create
            </Button>
          </Stack>
        </Paper>

        {/* BUDGET LIST CARDS */}
        {/* Added alignItems="stretch" to ensure equal height rows */}
        <Grid container spacing={4} alignItems="stretch">
          {progressBudgets.map((budget) => {
            const spent = budget.spent || 0;
            const limit = budget.limit || 0;
            const rawPercentage = (spent / limit) * 100;
            const visualPercentage = Math.min(rawPercentage, 100); 
            const remaining = limit - spent;
            const isOver = remaining < 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={budget._id}>
                <Paper
                  elevation={0}
                  sx={{
                      height: "100%", // Force card to take full height of the grid cell
                      display: "flex", 
                      flexDirection: "column", // Stack children vertically
                      p: 3.5, // Increased padding slightly for breathing room
                      borderRadius: 3, 
                      border: "1px solid", 
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: (theme) => `0 6px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                          transform: "translateY(-4px)"
                      }
                  }}
                  onClick={() => navigate(`/budget/${budget._id}`)}
                >
                  {/* Card Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2 }}>
                      {budget.category?.name || "Overall Budget"}
                    </Typography>
                    <Chip 
                      label={budget.period} 
                      size="small" 
                      sx={{ 
                        textTransform: 'capitalize', 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main'
                      }} 
                    />
                  </Box>
                  
                  {/* Amount Info */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
                    <Typography variant="h5" fontWeight={800} color="text.primary">
                      ₹{spent.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      of ₹{limit.toLocaleString()}
                    </Typography>
                  </Box>

                  {/* Progress Bar Container - pushed to the bottom using mt: 'auto' */}
                  <Box sx={{ mt: 'auto' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={visualPercentage} 
                      color={getProgressColor(rawPercentage)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        mb: 1.5,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                      }} 
                    />

                    {/* Footer Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary">
                        {rawPercentage.toFixed(0)}% Spent
                      </Typography>
                      <Typography 
                        variant="caption" 
                        fontWeight={700} 
                        color={isOver ? "error.main" : "success.main"}
                      >
                        {isOver ? `₹${Math.abs(remaining).toLocaleString()} Over Limit` : `₹${remaining.toLocaleString()} Left`}
                      </Typography>
                    </Box>
                  </Box>

                </Paper>
              </Grid>
            );
          })}
        </Grid>

      </Container>
    </Box>
  );
}

export default Budget;