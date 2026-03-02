import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Popover } from "@mui/material";
import dayjs from "dayjs";
import Navbar from "../../../Component/DashboardComponents/Navbar";
import DashboardDatePicker from "../../../Component/DashboardDatePicker";
import TransactionModal from "./TransactionModal";
import {
  fetchTransactions,
  deleteTransaction,
  fetchIncomeExpense
} from "../../../redux/Features/transactionSlice";
import "./Transaction.css";

const Transaction = () => {
  const dispatch = useDispatch();

  const { transactions, status } = useSelector(
    (state) => state.transaction
  );

  const { startDate, endDate } = useSelector(
    (state) => state.date
  );

  const userId = JSON.parse(
    localStorage.getItem("userInfo")
  )?._id;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [amountRange, setAmountRange] = useState([0, 10000]);

  // Date popover
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenDate = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDate = () => {
    setAnchorEl(null);
  };

  // 🔥 Fetch transactions when date changes
  useEffect(() => {
    if (userId && startDate && endDate) {
      dispatch(
        fetchTransactions({
          userId,
          startDate,
          endDate
        })
      );
    }
  }, [startDate, endDate, dispatch, userId]);

  // 🔹 Local filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesCategory =
        selectedCategory === "all" ||
        txn.category === selectedCategory;

      const matchesAmount =
        txn.amount >= amountRange[0] &&
        txn.amount <= amountRange[1];

      return matchesCategory && matchesAmount;
    });
  }, [transactions, selectedCategory, amountRange]);

  // 🔹 Group by date
  const groupedTransactions = useMemo(() => {
    const groups = {};

    filteredTransactions.forEach((txn) => {
      const dateKey = dayjs(txn.date).format("MMMM D, YYYY");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(txn);
    });

    return groups;
  }, [filteredTransactions]);

  // 🔥 Delete Handler
  const handleDelete = async (txnId) => {
    await dispatch(deleteTransaction(txnId));

    // Refresh everything
    dispatch(fetchTransactions({ userId, startDate, endDate }));
    dispatch(fetchIncomeExpense({ userId, startDate, endDate }));
  };

  return (
    <div className="transaction-page">
      <Navbar />

      <div className="transaction-container">

        {/* HEADER */}
        <div className="transaction-header">
          <h2>Transactions</h2>
        </div>

        {/* FILTER SECTION */}
        <div className="filter-box">
          <div className="filter-row">

            <div className="filter-item">
              <label>By category</label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
              >
                <option value="all">All categories</option>
                <option value="food">Food</option>
                <option value="rent">Rent</option>
                <option value="transport">Transport</option>
                <option value="salary">Salary</option>
              </select>
            </div>

            <div className="filter-item">
              <label>By amount</label>
              <input
                type="range"
                min="0"
                max="10000"
                value={amountRange[1]}
                onChange={(e) =>
                  setAmountRange([0, Number(e.target.value)])
                }
              />
              <span>0 - ${amountRange[1]}</span>
            </div>

            <div className="filter-item date-filter">
              <label>Date</label>
              <button
                className="date-btn"
                onClick={handleOpenDate}
              >
                {dayjs(startDate).format("MMM D, YYYY")} –{" "}
                {dayjs(endDate).format("MMM D, YYYY")} 📅
              </button>
            </div>

            <button
              className="reset-btn"
              onClick={() => {
                setSelectedCategory("all");
                setAmountRange([0, 10000]);
              }}
            >
              Reset Filters
            </button>

          </div>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleCloseDate}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <DashboardDatePicker onClose={handleCloseDate} />
          </Popover>
        </div>

        {/* ADD BUTTON */}
        <button
          className="add-btn"
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
        >
          + Add Transaction
        </button>

        {/* TRANSACTION LIST */}
        <div className="transaction-list">

          {status === "loading" && <p>Loading...</p>}

          {Object.keys(groupedTransactions).length === 0 && (
            <p>No transactions found</p>
          )}

          {Object.entries(groupedTransactions).map(
            ([date, txns]) => (
              <div key={date} className="transaction-date-group">

                <h4 className="date-header">{date}</h4>

                {txns.map((txn) => (
                  <div
                    key={txn._id}
                    className="transaction-item"
                  >
                    <div className="left">
                      <div className="circle-icon" />
                      <div>
                        <p className="title">
                          {txn.description || "Transaction"}
                        </p>
                        <span className="category">
                          {txn.type}
                        </span>
                      </div>
                    </div>

                    <div className="right">
                      <div
                        className={`amount ${
                          txn.type === "income"
                            ? "income"
                            : "expense"
                        }`}
                      >
                        {txn.type === "income" ? "+" : "-"}$
                        {txn.amount}
                      </div>

                      <div className="actions">
                        <button
                          onClick={() => {
                            setEditData(txn);
                            setIsModalOpen(true);
                          }}
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(txn._id)
                          }
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>

      {/* MODAL */}
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
    </div>
  );
};

export default Transaction;