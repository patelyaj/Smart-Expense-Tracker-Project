import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Popover,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DashboardDatePicker from "../DashboardDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncomeExpense } from "../../redux/Features/transactionSlice";

const IncomeExpenseCards = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))._id : null;
  const { income, expense } = useSelector((state) => state.transaction);
  const { startDate, endDate } = useSelector((state) => state.date);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (userId) {
      dispatch(fetchIncomeExpense({ userId,startDate, endDate }));
    }
  }, [startDate, endDate, dispatch,userId]);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>

      {/* Income Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Income
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#2e7d32">
                  +${income.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Expense Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "#ffebee", color: "#c62828" }}>
                <TrendingDownIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Expense
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#c62828">
                  -${expense.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Date Filter Card */}
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            borderRadius: 3,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {dayjs(startDate).format("MMM D")} -{" "}
            {dayjs(endDate).format("MMM D")}
          </Button>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <DashboardDatePicker
              onClose={() => setAnchorEl(null)}
            />
          </Popover>
        </Card>
      </Grid>
    </Grid>
  );
};

export default IncomeExpenseCards;