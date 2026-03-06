import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Autocomplete, Stack
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
// Import toast for notifications
import { toast } from "react-toastify";

import {
  addTransaction, editTransaction, fetchTransactions, fetchIncomeExpense
} from "../../../redux/Features/transactionSlice";
import { fetchCategories } from "../../../redux/Features/categorySlice"; // IMPORT THIS

// Import budget progress to calculate alerts
import { fetchBudgetProgress } from "../../../redux/Features/budgetSlice";

const TransactionModal = ({ onClose, mode = "add", existingData = null, userId, startDate, endDate }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);

  // Retrieve data needed for smart alerts
  const { income, expense } = useSelector((state) => state.transaction);
  const { progressBudgets } = useSelector((state) => state.budget);

  useEffect(() => {
    // Fetch categories when the modal opens
    dispatch(fetchCategories());
  }, [dispatch]);

  const existingCategoryName = existingData?.category?.name || existingData?.category || "";

  const [formData, setFormData] = useState({
    title: existingData?.title || "",
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

        // Smart alerts logic begins here
        const amountNum = Number(formData.amount);

        if (formData.type === "income") {
          toast.success(`Awesome! You just added \u20B9${amountNum} to your income!`);

        } else if (formData.type === "expense") {
          
          let budgetAlertFired = false;
          
          // Get all budgets that match the selected category
          const matchingBudgets = progressBudgets?.filter(b => b.category?.name === formData.category);

          if (matchingBudgets && matchingBudgets.length > 0) {
            // Loop through each matching budget to check its individual limit
            matchingBudgets.forEach(budget => {
              const newSpent = budget.spent + amountNum;
              const percentage = newSpent / budget.limit;
              
              // Capitalize the period name for the message
              const periodText = budget.period ? budget.period.charAt(0).toUpperCase() + budget.period.slice(1) : "";

              if (percentage >= 1) {
                toast.error(`Red Alert: You exceeded your ${periodText} ${formData.category} budget!`);
                budgetAlertFired = true;
              } else if (percentage >= 0.9) {
                toast.warn(`Careful! You've used over 90% of your ${periodText} ${formData.category} budget.`);
                budgetAlertFired = true;
              } else if (percentage >= 0.5) {
                toast.info(`You've spent half of your ${periodText} ${formData.category} budget.`);
              }
            });
          }

          if (income > 0 && !budgetAlertFired) {
             const newTotalExpense = expense + amountNum;
             const overallPct = newTotalExpense / income;

             if (overallPct >= 0.9) {
               toast.error(`Warning: You have spent 90% of your total income this month!`);
             } else if (overallPct >= 0.5) {
               toast.info(`Heads up: You have spent 50% of your earned income.`);
             } else {
               toast.success("Transaction added successfully.");
             }
          } else if (!budgetAlertFired) {
             toast.success("Transaction added successfully.");
          }
        }
        // Smart alerts logic ends here

      } else {
        await dispatch(editTransaction({ transactionId: existingData._id, updatedData: payload })).unwrap();
        // Added success toast for edit updates
        toast.success("Transaction updated successfully.");
      }

      // Refresh Data
      dispatch(fetchTransactions({ userId, startDate, endDate }));
      
      dispatch(fetchIncomeExpense({ userId, startDate, endDate }));
      
      // Update budgets to reflect the new transaction
      dispatch(fetchBudgetProgress(userId));

      // 3. Refetch categories just in case they added a brand new one in the FreeSolo input!
      dispatch(fetchCategories());
      
      onClose();
    } catch (error) {
      console.error("Failed to save transaction", error);
      // Added error toast
      toast.error("Failed to save transaction.");
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
                  type="text"
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  fullWidth required
                />
                
            <TextField
              type="number"
              label="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth required
              InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>&#8377;</span> }}
            />

            {/* The dropdown now feeds off the database! */}
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

            <DatePicker
              label="Date"
              value={dayjs(formData.date)}
              onChange={(newDate) =>
                setFormData({
                  ...formData,
                  date: newDate.format("YYYY-MM-DD"),
                })
              }
              disableFuture
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
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