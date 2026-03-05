import React, { useEffect, useState } from "react";
import Navbar from "../../../Component/DashboardComponents/Navbar";

import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Stack
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchBudgetProgress,
  createBudget
} from "../../../redux/Features/budgetSlice";

import dayjs from "dayjs";

function Budget() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  const progressBudgets =
    useSelector((state) => state.budget?.progressBudgets) || [];

  const [category, setCategory] = useState("overall");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState("monthly");



  useEffect(() => {

    if (userId) {
      dispatch(fetchBudgetProgress(userId));
    }

  }, [dispatch, userId]);



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
      limit,
      period,
      startDate,
      endDate
    }));

    dispatch(fetchBudgetProgress(userId));

  };



  return (

    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>

      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 5 }}>

        <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
          Budgets
        </Typography>


        {/* CREATE BUDGET */}

        <Paper sx={{ p: 3, borderRadius: 3, mb: 4, border: "1px solid #e5e7eb" }}>

          <Typography fontWeight={700} sx={{ mb: 2 }}>
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
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Shopping">Shopping</MenuItem>

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


            <Button
              variant="contained"
              onClick={handleCreateBudget}
            >
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
              border: "1px solid #e5e7eb",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/budget/${budget._id}`)}
          >

            <Typography fontWeight={700}>
              {budget.category?.name || "Overall Budget"}
            </Typography>

            <Typography color="text.secondary">
              Limit: ${budget.limit}
            </Typography>

          </Paper>

        ))}

      </Container>

    </Box>

  );

}

export default Budget;