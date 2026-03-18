import React, { useEffect, useState } from "react";
import Navbar from "../../../Component/DashboardComponents/Navbar";
import {
  Box, Container, Typography, Paper, TextField, MenuItem, Button, Stack,
  LinearProgress, Chip, CircularProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchBudget, createBudget } from "../../../redux/Features/budgetSlice";
import { fetchCategories } from "../../../redux/Features/categorySlice"; 
import dayjs from "dayjs";

function Budget() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  // Extracted status to handle page load states
  const { progressBudgets, status, isBudgetStale } = useSelector((state) => state.budget);
  const budgetsList = progressBudgets || [];
  const { categoriesFetched } = useSelector((state)=>state.category);
  
  const { categories } = useSelector((state) => state.category);

  const [category, setCategory] = useState("overall");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState("monthly");
  
  // Loading state for form submission
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (userId && isBudgetStale) {
      dispatch(fetchBudget()); 
      if (!categoriesFetched) {
            dispatch(fetchCategories())
          }
    }
  }, [dispatch, userId, isBudgetStale]);

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleCreateBudget = async () => {
    setIsCreating(true); // Start spinner
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

    try {
      await dispatch(createBudget({
        userId,
        category: category === "overall" ? null : category, 
        limit: Number(limit),
        period,
        startDate,
        endDate
      })).unwrap(); // Use unwrap if supported in your slice
      
      // await dispatch(fetchBudgetProgress(userId));
      setLimit(""); 
    } catch (error) {
      console.error("Failed to create budget", error);
    } finally {
      setIsCreating(false); // Stop spinner
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "error";
    if (percentage >= 85) return "warning";
    return "primary"; 
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
            p: { xs: 3, md: 4 }, 
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
              label="Budget Limit (INR)"
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
              disabled={!limit || isCreating}
              sx={{ px: 4, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600, minHeight: '40px', minWidth: '120px' }}
              disableElevation
            >
              {isCreating ? <CircularProgress size={24} color="inherit" /> : "Create"}
            </Button>
          </Stack>
        </Paper>

        {/* BUDGET LIST CARDS */}
        {status === 'loading' && budgetsList.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress size={50} thickness={4} />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              },
              gap: 4
            }}
          >
            {budgetsList.map((budget) => {
              const spent = budget.spent || 0;
              const limit = budget.limit || 0;
              const rawPercentage = limit > 0 ? (spent / limit) * 100 : 0;
              const visualPercentage = Math.min(rawPercentage, 100); 
              const remaining = limit - spent;
              const isOver = remaining < 0;

              return (
                <Paper
                  key={budget._id}
                  elevation={0}
                  sx={{
                      height: "100%",
                      display: "flex", 
                      flexDirection: "column",
                      p: 3.5,
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
                      &#8377;{spent.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      of &#8377;{limit.toLocaleString()}
                    </Typography>
                  </Box>

                  {/* Progress Bar Container */}
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
                        &#8377;{isOver ? `${Math.abs(remaining).toLocaleString()} Over Limit` : `${remaining.toLocaleString()} Left`}
                      </Typography>
                    </Box>
                  </Box>

                </Paper>
              );
            })}
          </Box>
        )}

      </Container>
    </Box>
  );
}

export default Budget;