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

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBudgetDetails,
  deleteBudget
} from "../../../redux/Features/budgetSlice";


function BudgetDetails() {

  const dispatch = useDispatch();

  const { budgetId } = useParams();

  const { budgetDetails } =
    useSelector((state) => state.budget);



  useEffect(() => {

    if (budgetId) {
      dispatch(fetchBudgetDetails(budgetId));
    }

  }, [budgetId]);



  if (!budgetDetails) return null;



  const progress =
    budgetDetails.limit
      ? (budgetDetails.spent / budgetDetails.limit) * 100
      : 0;



  return (

    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>

      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 5 }}>

        <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
          Budget Details
        </Typography>



        {/* STATS */}

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>

          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography>Originally Budgeted</Typography>
            <Typography variant="h5">
              ${budgetDetails.limit}
            </Typography>
          </Paper>


          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography>Spent so far</Typography>
            <Typography color="error" variant="h5">
              ${budgetDetails.spent}
            </Typography>
          </Paper>


          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography>Money left</Typography>
            <Typography color="success.main" variant="h5">
              ${budgetDetails.remaining}
            </Typography>
          </Paper>


          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography>You can spend</Typography>
            <Typography variant="h5">
              ${budgetDetails.dailyAllowed}/day
            </Typography>
          </Paper>

        </Stack>



        {/* PROGRESS BAR */}

        <Paper sx={{ p: 4 }}>

          <Typography sx={{ mb: 2 }}>
            Budget Progress
          </Typography>

          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 14,
              borderRadius: 7
            }}
          />

        </Paper>



        {/* ACTIONS */}

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>

          <Button variant="contained">
            Edit Budget
          </Button>

          <Button
            color="error"
            variant="outlined"
            onClick={() => dispatch(deleteBudget(budgetId))}
          >
            Delete Budget
          </Button>

        </Stack>

      </Container>

    </Box>

  );

}

export default BudgetDetails;