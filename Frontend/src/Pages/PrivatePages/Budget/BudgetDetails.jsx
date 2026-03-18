import React, { useEffect, useState } from "react";
import Navbar from "../../../Component/DashboardComponents/Navbar";

import {
  Box,
  Container,
  Typography,
  Paper,
  LinearProgress,
  Stack,
  Button,
  CircularProgress
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBudgetDetails,
  deleteBudget
} from "../../../redux/Features/budgetSlice";

import { Skeleton } from "@mui/material";

function BudgetDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { budgetId } = useParams();

  const { budgetDetails, status } = useSelector((state) => state.budget);
  
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (budgetId) {
      dispatch(fetchBudgetDetails(budgetId));
    }
  }, [budgetId, dispatch]);

    // Provide a proper loading skeleton state screen while details are fetched
    if (!budgetDetails || !budgetDetails.budget || status === 'loading') {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton width="30%" height={40} animation="wave" />
        <Skeleton height={100} sx={{ mt: 3 }} animation="wave" />
        <Skeleton height={100} sx={{ mt: 2 }} animation="wave" />
      </Box>
    );
  }

  const limit = budgetDetails.budget.limit;
  const progress = limit ? (budgetDetails.spent / limit) * 100 : 0;

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteBudget(budgetId)).unwrap();
      navigate("/budget"); 
    } catch (error) {
      console.error("Failed to delete budget", error);
      setIsDeleting(false); // Only stop loading if it failed, otherwise we are unmounting anyway
    }
  };

  return (
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
          <Paper sx={{ p: 3, flex: 1, bgcolor: "background.paper" }}>
            <Typography color="text.secondary">Originally Budgeted</Typography>
            <Typography variant="h5" color="text.primary">
              &#8377;{limit}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, bgcolor: "background.paper" }}>
            <Typography color="text.secondary">Spent so far</Typography>
            <Typography color="error.main" variant="h5">
              &#8377;{budgetDetails.spent}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, bgcolor: "background.paper" }}>
            <Typography color="text.secondary">Money left</Typography>
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
              bgcolor: "background.default", 
              "& .MuiLinearProgress-bar": {
                backgroundColor: progress > 100 ? "error.main" : "primary.main"
              }
            }}
          />
        </Paper>

        {/* ACTIONS */}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            sx={{ minWidth: '150px' }}
          >
            {isDeleting ? <CircularProgress size={24} color="inherit" /> : "Delete Budget"}
          </Button>
        </Stack>

      </Container>
    </Box>
  );
}

export default BudgetDetails;