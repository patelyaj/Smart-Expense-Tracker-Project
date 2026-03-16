import React, { useEffect } from "react";
import { Card, CardContent, Typography, Box, Avatar, CircularProgress } from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { useDispatch, useSelector } from "react-redux";
import { fetchIncomeExpense } from "../../redux/Features/transactionSlice";
import { alpha } from "@mui/material/styles";

const FinancialSummary = () => {
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))._id
    : null;

  const { income, expense, netBalance, status } = useSelector(
    (state) => state.transaction
  );

  const { startDate, endDate } = useSelector((state) => state.date);

  useEffect(() => {
    if (userId) {
      dispatch(fetchIncomeExpense({ userId, startDate, endDate }));
    }
  }, [startDate, endDate, dispatch, userId]);

  const cardStyle = {
    flex: 1,
    minWidth: 300,
    borderRadius: 3,
    border: (theme) => `1px solid ${theme.palette.divider}`,
    bgcolor: "background.paper",
    boxShadow: "none",
    transition: "all 0.25s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 4,
    },
  };

  const cardContent = {
    p: 4,
    display: "flex",
    alignItems: "center",
    gap: 3,
    minHeight: 150,
  };

  const avatarBase = {
    width: 64,
    height: 64,
    border: "1px solid",
    borderColor: "divider",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap", 
        gap: 6,              // ⭐ space between cards
        justifyContent: "space-between",
        mb: 5,
      }}
    >
      {/* WALLET */}
      <Card sx={cardStyle}>
        <CardContent sx={cardContent}>
          <Avatar
            sx={{
              ...avatarBase,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
              color: "primary.main",
            }}
          >
            <AccountBalanceWalletIcon />
          </Avatar>

          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Wallet Balance
            </Typography>

            <Typography variant="h2" fontWeight={700} color="primary.main">
              {status === "loading"
                ? <CircularProgress size={30}/>
                : `₹${netBalance?.toLocaleString() || 0}`}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* INCOME */}
      <Card sx={cardStyle}>
        <CardContent sx={cardContent}>
          <Avatar
            sx={{
              ...avatarBase,
              bgcolor: (t) => alpha(t.palette.success.main, 0.12),
              color: "success.main",
            }}
          >
            <PaymentsIcon />
          </Avatar>

          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Total Income
            </Typography>

            <Typography variant="h2" fontWeight={700} color="success.main">
              {status === "loading"
                ? <CircularProgress size={30}/>
                : `+₹${income?.toLocaleString() || 0}`}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* EXPENSE */}
      <Card sx={cardStyle}>
        <CardContent sx={cardContent}>
          <Avatar
            sx={{
              ...avatarBase,
              bgcolor: (t) => alpha(t.palette.error.main, 0.12),
              color: "error.main",
            }}
          >
            <ReceiptLongIcon />
          </Avatar>

          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Total Expense
            </Typography>

            <Typography variant="h2" fontWeight={700} color="error.main">
              {status === "loading"
                ? <CircularProgress size={30}/>
                : `-₹${expense?.toLocaleString() || 0}`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinancialSummary;