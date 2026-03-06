import React, { useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Avatar } from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { useDispatch, useSelector } from "react-redux";
import { fetchIncomeExpense } from "../../redux/Features/transactionSlice";
// import { fetchBalance } from "../../redux/Features/balanceSlice";
import { alpha } from "@mui/material/styles";

const FinancialSummary = () => {
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))._id
    : null;

  const { income, expense , netBalance } = useSelector((state) => state.transaction);
  
  const { startDate, endDate } = useSelector((state) => state.date);

  useEffect(() => {
    if (userId) {
      dispatch(fetchIncomeExpense({ userId, startDate, endDate }));
    
    }
  }, [startDate, endDate, dispatch, userId]);

  const cardStyle = {
    borderRadius: 3,
    border: (theme) => `1px solid ${theme.palette.divider}`,
    bgcolor: "background.paper",
    boxShadow: "none",
    transition: "all 0.25s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 4,
    },
    p : 5
  };

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center" 
      sx={{ mb: 4 }}
      
    >

      {/* BALANCE */}
      <Grid item xs={12} sm={6} md={4} sx={{ maxWidth: 380 }}>
        <Card sx={cardStyle 
        }>
          <CardContent
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              height: 110,
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: "primary.main",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <AccountBalanceWalletIcon />
            </Avatar>

            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize={20}>
                Wallet Balance
              </Typography>

              <Typography variant="h2" fontWeight={700} color="primary.main">
                &#8377;{netBalance?.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* INCOME */}
      <Grid item xs={12} sm={6} md={4} sx={{ maxWidth: 380 }}>
        <Card sx={cardStyle}>
          <CardContent
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              height: 110,
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                color: "success.main",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <PaymentsIcon />
            </Avatar>

            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Total Income
              </Typography>

              <Typography variant="h4" fontWeight={700} color="success.main">
                +&#8377;{income?.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* EXPENSE */}
      <Grid item xs={12} sm={6} md={4} sx={{ maxWidth: 380 }}>
        <Card sx={cardStyle}>
          <CardContent
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              height: 110,
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.12),
                color: "error.main",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <ReceiptLongIcon />
            </Avatar>

            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Total Expense
              </Typography>

              <Typography variant="h4" fontWeight={700} color="error.main">
                -&#8377;{expense?.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
};

export default FinancialSummary;