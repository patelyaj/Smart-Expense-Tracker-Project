import React, { useEffect } from "react";
import Navbar from "../../../Component/DashboardComponents/Navbar";

import {
  Box,
  Container,
  Typography,
  Paper,
  LinearProgress,
  Stack,
  Button
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBudgetDetails,
  deleteBudget
} from "../../../redux/Features/budgetSlice";

function BudgetDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { budgetId } = useParams();

  const { budgetDetails } = useSelector((state) => state.budget);

  useEffect(() => {
    if (budgetId) {
      dispatch(fetchBudgetDetails(budgetId));
    }
  }, [budgetId, dispatch]);

  // Make sure we have the nested budget object before rendering
  if (!budgetDetails || !budgetDetails.budget) return null;

  // FIX: limit is nested inside budgetDetails.budget!
  const limit = budgetDetails.budget.limit;
  
  const progress = limit 
    ? (budgetDetails.spent / limit) * 100 
    : 0;

  return (
    // Automatically uses theme.palette.background.default
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography 
          variant="h4" 
          fontWeight={800} 
          sx={{ mb: 4, color: "text.primary" }}
        >
          Budget Details
        </Typography>

        {/* STATS */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          {/* Uses theme.palette.background.paper automatically */}
          <Paper sx={{ p: 3, flex: 1, bgcolor: "background.paper" }}>
            <Typography color="text.secondary">Originally Budgeted</Typography>
            <Typography variant="h5" color="text.primary">
              &#8377;{limit}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, bgcolor: "background.paper" }}>
            <Typography color="text.secondary">Spent so far</Typography>
            {/* Uses theme.palette.error.main */}
            <Typography color="error.main" variant="h5">
              &#8377;{budgetDetails.spent}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, bgcolor: "background.paper" }}>
            <Typography color="text.secondary">Money left</Typography>
            {/* Uses theme.palette.success.main */}
            <Typography color="success.main" variant="h5">
              &#8377;{budgetDetails.remaining}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, bgcolor: "background.paper" }}>
            <Typography color="text.secondary">You can spend</Typography>
            <Typography variant="h5" color="text.primary">
              &#8377;{budgetDetails.dailyAllowed?.toFixed(2)}/day
            </Typography>
          </Paper>
        </Stack>

        {/* PROGRESS BAR */}
        <Paper sx={{ p: 4, bgcolor: "background.paper" }}>
          <Typography sx={{ mb: 2, color: "text.primary" }}>
            Budget Progress ({progress.toFixed(1)}%)
          </Typography>

          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 14,
              borderRadius: 7,
              bgcolor: "background.default", // subtle background for the unfilled track
              "& .MuiLinearProgress-bar": {
                // If over 100%, make the bar red, otherwise use standard primary blue
                backgroundColor: progress > 100 ? "error.main" : "primary.main"
              }
            }}
          />
        </Paper>

        {/* ACTIONS */}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          {/* Removed the Edit Button here as requested! */}
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              dispatch(deleteBudget(budgetId)).then(() => {
                navigate("/budget"); // Navigate back to list after delete
              });
            }}
          >
            Delete Budget
          </Button>
        </Stack>

      </Container>
    </Box>
  );
}

export default BudgetDetails;