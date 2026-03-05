import React, { useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncomeExpense } from "../../redux/Features/transactionSlice";
import { fetchBalance } from "../../redux/Features/balanceSlice";
import { alpha } from '@mui/material/styles';

const FinancialSummary = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))._id : null;
  
  const { income, expense } = useSelector((state) => state.transaction);
  const { balance } = useSelector((state) => state.balance);
  const { startDate, endDate } = useSelector((state) => state.date);

  useEffect(() => {
    if (userId) {
      dispatch(fetchIncomeExpense({ userId, startDate, endDate }));
      dispatch(fetchBalance(userId));
    }
  }, [startDate, endDate, dispatch, userId]);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* 2. BALANCE */}
      <Grid item xs={12} md={5}>
        <Card sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none', bgcolor: 'background.paper' }}>
          <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 50, height: 50, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
              <AccountBalanceWalletIcon />
            </Avatar>
            
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Current Balance
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                ${balance?.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* 1. INCOME (LEFT) */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none', bgcolor: 'background.paper' }}>
          <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 50, height: 50, bgcolor: (theme) => alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
              <TrendingUpIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Total Income
              </Typography>
              <Typography variant="h5" fontWeight={700} color="success.main">
                +${income?.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>


      {/* 3. EXPENSE (RIGHT) */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none', bgcolor: 'background.paper' }}>
          <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 50, height: 50, bgcolor: (theme) => alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
              <TrendingDownIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Total Expense
              </Typography>
              <Typography variant="h5" fontWeight={700} color="error.main">
                -${expense?.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
};

export default FinancialSummary;