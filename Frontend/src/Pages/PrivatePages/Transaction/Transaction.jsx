import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { 
  Container, Box, Typography, Button, IconButton, Paper, 
  Avatar, Stack, Chip, Divider, MenuItem, TextField, Popover, InputAdornment
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

import Navbar from "../../../Component/DashboardComponents/Navbar";
import TransactionModal from "./TransactionModal";
import { fetchTransactions, deleteTransaction, fetchIncomeExpense } from "../../../redux/Features/transactionSlice";
import { fetchCategories } from "../../../redux/Features/categorySlice";

// Import budget progress to keep it in sync for alerts
import { fetchBudgetProgress } from "../../../redux/Features/budgetSlice";

import DashboardDatePicker from "../../../Component/DashboardDatePicker";

import { Dialog, DialogTitle, DialogContent } from "@mui/material";

const Transaction = () => {
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;
  
  const { transactions, status } = useSelector((state) => state.transaction);
  const { categories } = useSelector((state) => state.category); 

  // Main date state that actually triggers API calls
  const [startDate, setStartDate] = useState(dayjs().startOf("month").toISOString());
  const [endDate, setEndDate] = useState(dayjs().endOf("month").toISOString());

  // Modal state for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Filters applied only on frontend (no API call needed)
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [descModalOpen, setDescModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  // Temporary date values used inside the popover before clicking "Apply"
  const [anchorEl, setAnchorEl] = useState(null);


  const openDatePopover = Boolean(anchorEl);

  // Whenever final date changes → refetch transactions + categories
  useEffect(() => {
    if (userId && startDate && endDate) {
      dispatch(fetchTransactions({ userId, startDate, endDate }));
      dispatch(fetchCategories()); 
      // Fetch income, expense, and budgets so the modal has data for smart alerts
      dispatch(fetchIncomeExpense({ userId, startDate, endDate }));
      dispatch(fetchBudgetProgress(userId));
    }
  }, [startDate, endDate, dispatch, userId]);

  // Apply frontend filters (category + search)
 const filteredTransactions = useMemo(() => {
  const query = searchQuery.toLowerCase();

  return transactions.filter((txn) => {
    const catName = txn.category?.name || "Uncategorized";
    const description = txn.description || "";
    const title = txn.title || "";

    // Category filter
    const matchesCategory =
      selectedCategory === "all" || catName === selectedCategory;

    // Search filter (title OR description)
    const matchesSearch =
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}, [transactions, selectedCategory, searchQuery]);

  // Group transactions by date for display
  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach((txn) => {
      const dateKey = dayjs(txn.date).format("MMMM D, YYYY");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(txn);
    });
    return groups;
  }, [filteredTransactions]);

  // Delete transaction and refresh related data
  const handleDelete = async (txnId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await dispatch(deleteTransaction(txnId)).unwrap();
      dispatch(fetchTransactions({ userId, startDate, endDate }));
      dispatch(fetchIncomeExpense({ userId, startDate, endDate }));
      // Refresh budget progress after deletion
      dispatch(fetchBudgetProgress(userId));
    }
  };


  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 5 }}>
        
        {/* Page header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Transactions
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => { setEditData(null); setIsModalOpen(true); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 2 }}
            disableElevation
          >
            Add Transaction
          </Button>
        </Box>

        {/* Filters */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2.5, mb: 4, borderRadius: 3, 
            display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }} 
        >
          {/* Search input */}
          <TextField
            placeholder="Search By Description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Category filter */}
          <TextField
            select
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat.name}>{cat.name}</MenuItem>
            ))}
          </TextField>

          {/* Date range selector */}
          <Button
            variant="outlined"
            endIcon={<CalendarMonthIcon />}
            onClick={(e) => {
              
              setAnchorEl(e.currentTarget);
            }}
            sx={{ 
              borderRadius: 2, textTransform: 'none', fontWeight: 600, 
              color: 'text.primary', borderColor: 'divider', px: 3, py: 1, gap : 4
            }}
          >
            {dayjs(startDate).format("MMM D, YYYY")} — {dayjs(endDate).format("MMM D, YYYY")}
          </Button>

          {/* Date popover */}
          {/* Floating Calendar Interface */}
          <Popover 
            open={openDatePopover} 
            anchorEl={anchorEl} 
            onClose={() => setAnchorEl(null)} 
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            PaperProps={{ sx: { mt: 1, borderRadius: 3, boxShadow: 4 } }}
          >
             <DashboardDatePicker 
              initialStartDate={startDate}
              initialEndDate={endDate}
              onApply={(newStart, newEnd) => {
                // Update Local state ONLY when Apply is clicked!
                setStartDate(newStart);
                setEndDate(newEnd);
              }}
              onClose={() => setAnchorEl(null)} 
            />
          </Popover>
        </Paper>

        {/* Loading / Empty state */}
        {status === "loading" && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Loading records...
          </Typography>
        )}

        {Object.keys(groupedTransactions).length === 0 && status !== "loading" && (
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: (theme) => `1px dashed ${theme.palette.divider}` }} elevation={0}>
            <Typography variant="h6" color="text.secondary">
              No transactions found for these filters.
            </Typography>
          </Paper>
        )}

        {/* Transactions list */}
        <Stack spacing={4}>
          {Object.entries(groupedTransactions).map(([date, txns]) => (
            <Box key={date}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, ml: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {date} ------------------------------------------------------------------------------------------------------------------------------------
              </Typography>
              
              <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: (theme) => `1px solid ${theme.palette.divider}` }} elevation={0}>
                {txns.map((txn, index) => {
                  const isIncome = txn.type === "income";
                  const catName = txn.category?.name || "Uncategorized";
                  const description = txn.description || "No description";

                  return (
                    <React.Fragment key={txn._id}>
                      <Box sx={{ 
                        p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03) } 
                      }}>
                        
                        {/* Left side info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                          <Avatar sx={{ 
                            width: 48, height: 48,
                            bgcolor: (theme) => alpha(theme.palette[isIncome ? 'success' : 'error'].main, 0.1), 
                            color: isIncome ? 'success.main' : 'error.main' 
                          }}>
                            {isIncome ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          </Avatar>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>

                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ lineHeight: 1.2 }}
                              >
                                {txn.title}
                              </Typography>

                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary", fontWeight: 500 }}
                                >
                                  {catName}
                                </Typography>

                                {description && (
                                  <Button
                                    size="small"
                                    sx={{
                                      textTransform: "none",
                                      fontSize: "0.7rem",
                                      minWidth: "auto",
                                      padding: "0px 6px",
                                      color: "primary.main"
                                    }}
                                    onClick={() => {
                                      setSelectedDescription(description);
                                      setDescModalOpen(true);
                                    }}
                                  >
                                    • View description
                                  </Button>
                                )}

                              </Box>

                            </Box>
                        </Box>

                        {/* Right side actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Typography variant="h6" fontWeight={800} color={isIncome ? 'success.main' : 'error.main'}>
                            {isIncome ? "+" : "-"}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => { setEditData(txn); setIsModalOpen(true); }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(txn._id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                      {index !== txns.length - 1 && <Divider />}
                    </React.Fragment>
                  )
                })}
              </Paper>
            </Box>
          ))}
        </Stack>

      </Container>

      {/* Modal */}
      {isModalOpen && (
        <TransactionModal
          onClose={() => setIsModalOpen(false)}
          mode={editData ? "edit" : "add"}
          existingData={editData}
          userId={userId}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      <Dialog
        open={descModalOpen}
        onClose={() => setDescModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Description</DialogTitle>

        <DialogContent>
          <Typography>
            {selectedDescription || "No description provided."}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Transaction;