import React, { useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  addTransaction,
  editTransaction,
  fetchTransactions,
  fetchIncomeExpense
} from "../../../redux/Features/transactionSlice";
import "./TransactionModal.css";

const TransactionModal = ({
  onClose,
  mode = "add", // add | edit
  existingData = null,
  userId,
  startDate,
  endDate
}) => {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    amount: existingData?.amount || "",
    type: existingData?.type || "expense",
    category: existingData?.category || "",
    date: existingData?.date
      ? dayjs(existingData.date).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD"),
    description: existingData?.description || ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      userId,
      amount: Number(formData.amount)
    };

    if (mode === "add") {
      await dispatch(addTransaction(payload));
    } else {
      await dispatch(
        editTransaction({
          transactionId: existingData._id,
          updatedData: payload
        })
      );
    }

    // 🔥 Refresh everything
    dispatch(fetchTransactions({ userId, startDate, endDate }));
    dispatch(fetchIncomeExpense({ userId, startDate, endDate }));

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h3>{mode === "add" ? "Add Transaction" : "Edit Transaction"}</h3>

        <form onSubmit={handleSubmit}>

          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Category ID"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />

          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value
              })
            }
          />

          <div className="modal-actions">
            <button type="submit">
              {mode === "add" ? "Add" : "Update"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TransactionModal;