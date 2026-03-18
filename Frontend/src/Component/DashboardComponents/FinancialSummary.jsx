import React from "react";
import { Card, CardContent, Typography, Box, Avatar, CircularProgress } from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { useSelector } from "react-redux";
import { alpha } from "@mui/material/styles";
import {Skeleton} from "@mui/material";

const FinancialSummary = () => {
  const { income, expense, netBalance, status } = useSelector(
    (state) => state.transaction
  );

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
        gap: 6,              // space between cards
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
              {status === "loading" ? (
                <Skeleton animation="wave" width={120} height={40} />
              ) : (
                `₹${netBalance?.toLocaleString() || 0}`
              )}
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
                ? (
                <Skeleton animation="wave" width={120} height={40} />
              ) : `+₹${income?.toLocaleString() || 0}`}
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
                ? (
                  <Skeleton animation="wave" width={120} height={40} />
                ) : `-₹${expense?.toLocaleString() || 0}`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinancialSummary;