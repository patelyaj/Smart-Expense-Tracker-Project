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

const IncomeExpenseCards = () => {
  const income = 8500.0;
  const expense = 3450.25;

  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("week"),
    dayjs().endOf("week"),
  ]);

  const open = Boolean(anchorEl);

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
            {dateRange[0].format("MMM D")} -{" "}
            {dateRange[1].format("MMM D")}
          </Button>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <DashboardDatePicker
              value={dateRange}
              setValue={setDateRange}
              onClose={() => setAnchorEl(null)}
            />
          </Popover>
        </Card>
      </Grid>
    </Grid>
  );
};

export default IncomeExpenseCards;