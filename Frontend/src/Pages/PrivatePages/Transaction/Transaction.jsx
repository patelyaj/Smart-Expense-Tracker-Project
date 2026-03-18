import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { 
  Container, Box, Typography, Button, IconButton, Paper, 
  Avatar, Stack, Divider, MenuItem, TextField, Popover, InputAdornment, 
  CircularProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Import Infinite Scroll Library
import InfiniteScroll from 'react-infinite-scroll-component';

import Navbar from "../../../Component/DashboardComponents/Navbar";
import TransactionModal from "./TransactionModal";
import DashboardDatePicker from "../../../Component/DashboardDatePicker";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import api from "../../../utils/axiosInstance";

import { fetchTransactions, deleteTransaction, markTransactionsStale } from "../../../redux/Features/transactionSlice";
import { fetchCategories } from "../../../redux/Features/categorySlice";

const Transaction = () => {
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;
  
  const { transactions, status, totalPages, isTransactionsStale } = useSelector((state) => state.transaction);
  const { categories, categoriesFetched } = useSelector((state)=> state.category);
  
  // Filter States
  const [startDate, setStartDate] = useState(dayjs().startOf("month").toISOString());
  const [endDate, setEndDate] = useState(dayjs().endOf("month").toISOString());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Loading States
  const [isExporting, setIsExporting] = useState(false); 

  const openDatePopover = Boolean(anchorEl);

  // NEW: Smarter Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only trigger a new fetch if the search text actually changed
      if (searchQuery !== debouncedSearch) {
        setDebouncedSearch(searchQuery);
        setPage(1); // Reset to page 1 for the new search results
        dispatch(markTransactionsStale()); // Now we fetch!
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchQuery, debouncedSearch, dispatch]);

  useEffect(() => {
    // Prevent double fetching if already loading
    if (!categoriesFetched && status !== 'loading') {
      dispatch(fetchCategories())
    }
  }, [dispatch, categoriesFetched, status]);

  useEffect(() => {
    if (userId && startDate && endDate && isTransactionsStale) {
      dispatch(fetchTransactions({ 
        userId, startDate, endDate, page, limit: 10,
        search: debouncedSearch, category: selectedCategory 
      }));
    }
  }, [startDate, endDate, page, debouncedSearch, selectedCategory, dispatch, userId, isTransactionsStale]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    transactions.forEach((txn) => {
      const dateKey = dayjs(txn.date).format("MMMM D, YYYY");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(txn);
    });
    return groups;
  }, [transactions]);

  // NEW: Simplified handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);   
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); 
    dispatch(markTransactionsStale());
  };

  const handleDelete = async (txnId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await dispatch(deleteTransaction(txnId));
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const response = await api.get(`/transactions/export-csv`, {
        params: { startDate, endDate },
        responseType: 'blob',
        withCredentials: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Transactions_${dayjs(startDate).format('MMM_YYYY')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false); 
    }
  };

  // Function to load more data triggered by InfiniteScroll
  const fetchMoreData = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
      dispatch(markTransactionsStale());
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 5 }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Transactions
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />} 
              onClick={handleExportCsv}
              disabled={isExporting}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>

            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => { setEditData(null); setIsModalOpen(true); }}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
              disableElevation
            >
              Add Transaction
            </Button>
          </Box>
        </Box>

        {/* Filter Bar */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2.5, mb: 4, borderRadius: 3, 
            display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }} 
        >
          <TextField
            placeholder="Search By Description..."
            value={searchQuery}
            onChange={handleSearchChange}
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

          <TextField
            select
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat.name}>{cat.name}</MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            endIcon={<CalendarMonthIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ 
              borderRadius: 2, textTransform: 'none', fontWeight: 600, 
              color: 'text.primary', borderColor: 'divider', px: 3, py: 1
            }}
          >
            {dayjs(startDate).format("MMM D, YYYY")} - {dayjs(endDate).format("MMM D, YYYY")}
          </Button>

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
                setStartDate(newStart);
                setEndDate(newEnd);
                setPage(1);
                dispatch(markTransactionsStale());
              }}
              onClose={() => setAnchorEl(null)} 
            />
          </Popover>
        </Paper>

        {/* Initial Loading State - Only show full spinner on page 1 */}
        {status === "loading" && page === 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10 }}>
            <CircularProgress size={50} thickness={4} />
          </Box>
        )}

        {Object.keys(groupedTransactions).length === 0 && status !== "loading" && (
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: (theme) => `1px dashed ${theme.palette.divider}` }} elevation={0}>
            <Typography variant="h6" color="text.secondary">
              No transactions found for these filters.
            </Typography>
          </Paper>
        )}

        {/* Transactions list with Infinite Scroll */}
        {Object.keys(groupedTransactions).length > 0 && (
          <InfiniteScroll
            dataLength={transactions.length}
            next={fetchMoreData}
            hasMore={page < totalPages}
            loader={
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress size={30} />
              </Box>
            }
            endMessage={
              <Typography textAlign="center" color="text.secondary" sx={{ mt: 4, mb: 4, fontWeight: 500 }}>
                You've reached the end of your transactions.
              </Typography>
            }
            // Optional: You can adjust this threshold. 0.8 means it triggers when 80% down the page
            scrollThreshold={0.8}
          >
            <Stack spacing={4}>
              {Object.entries(groupedTransactions).map(([date, txns]) => (
                <Box key={date}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, ml: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {date} -------------------------------------------------
                  </Typography>
                  
                  <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: (theme) => `1px solid ${theme.palette.divider}` }} elevation={0}>
                    {txns.map((txn, index) => {
                      const isIncome = txn.type === "income";
                      const catName = txn.category?.name || "Uncategorized";

                      return (
                        <React.Fragment key={txn._id}>
                          <Box sx={{ 
                            p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                            transition: 'background-color 0.2s',
                            '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03) } 
                          }}>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                              <Avatar sx={{ 
                                width: 48, height: 48,
                                bgcolor: (theme) => alpha(theme.palette[isIncome ? 'success' : 'error'].main, 0.1), 
                                color: isIncome ? 'success.main' : 'error.main' 
                              }}>
                                {isIncome ? <TrendingUpIcon /> : <TrendingDownIcon />}
                              </Avatar>
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                <Typography variant="subtitle1" fontWeight={700}>
                                  {txn.title}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                    {catName}
                                  </Typography>
                                  {txn.description && (
                                    <Button
                                      size="small"
                                      sx={{ textTransform: "none", fontSize: "0.7rem", minWidth: "auto", color: "primary.main" }}
                                      onClick={() => { setSelectedDescription(txn.description); setDescModalOpen(true); }}
                                    >
                                      View description
                                    </Button>
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Typography variant="h6" fontWeight={800} color={isIncome ? 'success.main' : 'error.main'}>
                                {isIncome ? "+" : "-"}&#8377;{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                      );
                    })}
                  </Paper>
                </Box>
              ))}
            </Stack>
          </InfiniteScroll>
        )}

      </Container>

      {/* Modals */}
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

      <Dialog open={descModalOpen} onClose={() => setDescModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Description</DialogTitle>
        <DialogContent>
          <Typography>{selectedDescription || "No description provided."}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Transaction;