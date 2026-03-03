import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Autocomplete, Stack
} from "@mui/material";
import {
  addTransaction, editTransaction, fetchTransactions, fetchIncomeExpense
} from "../../../redux/Features/transactionSlice";
import { fetchCategories } from "../../../redux/Features/categorySlice"; // 🔥 IMPORT THIS

const TransactionModal = ({ onClose, mode = "add", existingData = null, userId, startDate, endDate }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    // Fetch categories when the modal opens
    dispatch(fetchCategories());
  }, [dispatch]);

  const existingCategoryName = existingData?.category?.name || existingData?.category || "";

  const [formData, setFormData] = useState({
    amount: existingData?.amount || "",
    type: existingData?.type || "expense",
    category: existingCategoryName,
    date: existingData?.date ? dayjs(existingData.date).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
    description: existingData?.description || ""
  });

  // if user switches type refetch category suggestions to match the type
  const categorySuggestions = categories
    .filter(cat => cat.type === formData.type)
    .map(cat => cat.name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      userId,
      amount: Number(formData.amount)
    };

    try {
      if (mode === "add") {
        await dispatch(addTransaction(payload)).unwrap();
      } else {
        await dispatch(editTransaction({ transactionId: existingData._id, updatedData: payload })).unwrap();
      }

      // Refresh Data
      dispatch(fetchTransactions({ userId, startDate, endDate }));
      dispatch(fetchIncomeExpense({ userId, startDate, endDate }));
      
      // 🔥 3. Refetch categories just in case they added a brand new one in the FreeSolo input!
      dispatch(fetchCategories());
      
      onClose();
    } catch (error) {
      console.error("Failed to save transaction", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {mode === "add" ? "Add Transaction" : "Edit Transaction"}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, category: "" })} 
              fullWidth
            >
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </TextField>

            <TextField
              type="number"
              label="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth required
              InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>$</span> }}
            />

            {/* 🔥 The dropdown now feeds off the database! */}
            <Autocomplete
              freeSolo
              options={categorySuggestions}
              value={formData.category}
              onInputChange={(event, newInputValue) => {
                setFormData({ ...formData, category: newInputValue });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Category" placeholder="Select or type new..." required />
              )}
            />

            <TextField
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth required
            />

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth multiline rows={2}
            />

          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button type="submit" variant="contained" disableElevation sx={{ fontWeight: 600, borderRadius: 2 }}>
            {mode === "add" ? "Save" : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionModal;