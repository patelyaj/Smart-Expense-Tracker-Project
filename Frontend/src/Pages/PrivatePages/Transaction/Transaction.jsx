import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../../Component/DashboardComponents/Navbar';
import DashboardDatePicker from '../../../Component/DashboardDatePicker';
import './Transaction.css'; 
import { fetchTransactions, addTransaction, editTransaction, deleteTransaction } from '../../../redux/Features/transactionSlice';

const Transaction = () => {
  const dispatch = useDispatch();
  //   const

  // TODO: Bring in your Redux state for transactions here
  const { transactions, status , isError } = useSelector((state) => state.transaction);

  // Separate state hooks for startDate and endDate
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Lifecycle hook to fetch transactions when the page loads or date range changes
  useEffect(() => {

  }, [startDate,endDate, dispatch]);

  // Handlers
  const handleOpenAddModal = () => {

    setIsAddModalOpen(true);
  };

  const handleDateChange = () => {
    
  };

  return (
    <div className="transaction-page-container">
      <Navbar/>
      <div className="transaction-header">
        <h2>Transactions</h2>
        
        <div className="transaction-controls">
          {/* Reusing your Dashboard Date Picker */}
          <div className="date-picker-wrapper">
            <DashboardDatePicker 
              onChange={handleDateChange} 
              // Pass any other necessary props your DatePicker requires
            />
          </div>

          <button 
            className="add-transaction-btn" 
            onClick={handleOpenAddModal}
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {/* TRANSACTION LIST SECTION */}
      <div className="transaction-list-container">
        {/* TODO: Implement your loading and error states here */}
        {/* {isLoading && <p>Loading transactions...</p>} */}

        {/* TODO: Map through your transactions. 
            You will likely need to group them by date before mapping 
            to achieve the "date by date" view you are looking for.
        */}
        
        <div className="transaction-date-group">
          {/* Example of how the structure should look once you map over the data */}
          <h3 className="transaction-date-header">February 27, 2026</h3>
          
          <ul className="transaction-items">
            {/* Dummy Item 1 */}
            <li className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-title">Groceries</span>
                <span className="transaction-category">Food</span>
              </div>
              <div className="transaction-amount expense">
                -$50.00
              </div>
            </li>

            {/* Dummy Item 2 */}
            <li className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-title">Salary</span>
                <span className="transaction-category">Income</span>
              </div>
              <div className="transaction-amount income">
                +$3,000.00
              </div>
            </li>
          </ul>
        </div>
        
        {/* TODO: Display a "No transactions found" message if the list is empty */}
      </div>

      {/* TODO: Render your Add Transaction Modal/Form component down here conditionally based on isAddModalOpen */}
      {isAddModalOpen && (
        <div className="modal-placeholder">
           {/* Add Transaction Form goes here */}
        </div>
      )}
    </div>
  );
};

export default Transaction;