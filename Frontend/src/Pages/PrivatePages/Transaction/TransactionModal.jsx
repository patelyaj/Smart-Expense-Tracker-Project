import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Autocomplete, Stack, CircularProgress
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";

import {
  addTransaction, editTransaction
} from "../../../redux/Features/transactionSlice";
import { markCategoriesStale } from "../../../redux/Features/categorySlice";

const TransactionModal = ({ onClose, mode = "add", existingData = null, userId }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  const { income, expense } = useSelector((state) => state.transaction);
  const { progressBudgets } = useSelector((state) => state.budget);

  // Added local loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingCategoryName = existingData?.category?.name || existingData?.category || "";

  const [formData, setFormData] = useState({
    title: existingData?.title || "",
    amount: existingData?.amount || "",
    type: existingData?.type || "expense",
    category: existingCategoryName,
    date: existingData?.date ? dayjs(existingData.date).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
    description: existingData?.description || ""
  });

  const categorySuggestions = categories
    .filter(cat => cat.type === formData.type)
    .map(cat => cat.name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.amount) <= 0) {
      return toast.error("Please enter an amount greater than zero.");
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      userId,
      amount: Number(formData.amount)
    };

    try {
      if (mode === "add") {
        await dispatch(addTransaction(payload)).unwrap();
        
        // Check if this category is brand new
        const isNewCategory = !categories.some(
            (cat) => cat.name.toLowerCase() === formData.category.toLowerCase() && cat.type === formData.type
        );
        
        if (isNewCategory) {
            // Mark state as stale. The useEffect in the parent component will handle the single fetch.
            dispatch(markCategoriesStale());
        }

        const amountNum = Number(formData.amount);
        if (formData.type === "income") {
          toast.success(`Awesome! Added \u20B9${amountNum} to income!`);
        } else if (formData.type === "expense") {
          let budgetAlertFired = false;
          const matchingBudgets = progressBudgets?.filter(b => b.category?.name === formData.category);

          if (matchingBudgets?.length > 0) {
            matchingBudgets.forEach(budget => {
              const newSpent = budget.spent + amountNum;
              const percentage = newSpent / budget.limit;
              const periodText = budget.period ? budget.period.charAt(0).toUpperCase() + budget.period.slice(1) : "";

              if (percentage >= 1) {
                toast.error(`Red Alert: Exceeded your ${periodText} ${formData.category} budget!`);
                budgetAlertFired = true;
              } else if (percentage >= 0.9) {
                toast.warn(`Careful! Over 90% of your ${periodText} ${formData.category} budget used.`);
                budgetAlertFired = true;
              }
            });
          }

          if (income > 0 && !budgetAlertFired) {
            const overallPct = (expense + amountNum) / income;
            if (overallPct >= 0.9) toast.error(`Warning: Spent 90% of total income this month!`);
            else toast.success("Transaction added successfully.");
          } else if (!budgetAlertFired) {
            toast.success("Transaction added successfully.");
          }
        }
      } else {
        await dispatch(editTransaction({ 
          transactionId: existingData._id, 
          updatedData: payload 
        })).unwrap();

        // Also check if they edited to a new category
        const isNewCategory = !categories.some(
            (cat) => cat.name.toLowerCase() === formData.category.toLowerCase() && cat.type === formData.type
        );
        if (isNewCategory) {
            // Mark state as stale.
            dispatch(markCategoriesStale());
        }

        toast.success("Transaction updated successfully.");
      }
      
      onClose();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error?.message || "Failed to save transaction.");
    } finally {
      setIsSubmitting(false); 
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

            <Autocomplete
              freeSolo
              options={categorySuggestions}
              value={formData.category}
              onChange={(event, newValue) => setFormData({ ...formData, category: newValue || "" })}
              onInputChange={(event, newInputValue) => setFormData({ ...formData, category: newInputValue })}
              renderInput={(params) => (
                <TextField {...params} label="Category" placeholder="Select or type new..." required />
              )}
            />

            <DatePicker
              label="Date"
              value={dayjs(formData.date)}
              onChange={(newDate) => {
                const formattedDate = newDate && newDate.isValid() 
                  ? newDate.format("YYYY-MM-DD") 
                  : "";
                setFormData({ ...formData, date: formattedDate });
              }}
              disableFuture
              slotProps={{ textField: { fullWidth: true, required: true } }}
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
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disableElevation 
            disabled={isSubmitting}
            sx={{ fontWeight: 600, borderRadius: 2, minWidth: "100px" }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (mode === "add" ? "Add" : "Update")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionModal;