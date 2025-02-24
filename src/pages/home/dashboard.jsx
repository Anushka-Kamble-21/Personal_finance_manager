import React, { useState } from "react";
import "./Dashboard.css";
import Insights from "../../components/Insights";


const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [frequency, setFrequency] = useState("Last Week");

  // State for new transaction inputs
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    title: "",
    amount: "",
    type: "income",
    category: "Other",
  });

  // Handles input changes
  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  // Adds new transaction manually
  const addTransaction = () => {
    if (!newTransaction.date || !newTransaction.title || !newTransaction.amount) {
      alert("Please fill all fields before adding a transaction.");
      return;
    }

    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

    // Reset form fields after adding
    setNewTransaction({
      date: "",
      title: "",
      amount: "",
      type: "income",
      category: "Other",
    });
  };

  const resetAll = () => {
    setTransactions([]);
    setTypeFilter("All");
    setFrequency("Last Week");
  };

  // Filter transactions based on selected Type
  const filteredTransactions =
    typeFilter === "All"
      ? transactions
      : transactions.filter((txn) => txn.type.toLowerCase() === typeFilter.toLowerCase());

  // Calculate totals for income, expenses, and savings
  const calculateTotals = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    let savingsTotal = 0;

    filteredTransactions.forEach((txn) => {
      const amount = parseFloat(txn.amount);

      if (txn.type === "income") incomeTotal += amount;
      else if (txn.type === "expense") expenseTotal += amount;
      else if (txn.type === "savings") savingsTotal += amount;
    });

    const totalAmount = incomeTotal + expenseTotal + savingsTotal;

    return { incomeTotal, expenseTotal, savingsTotal, totalAmount };
  };

  const { incomeTotal, expenseTotal, savingsTotal, totalAmount } = calculateTotals();

  // Calculate percentage for each category
  const calculatePercentage = (amount) => (totalAmount === 0 ? 0 : (amount / totalAmount) * 100);

  const incomePercentage = calculatePercentage(incomeTotal);
  const expensePercentage = calculatePercentage(expenseTotal);
  const savingsPercentage = calculatePercentage(savingsTotal);

  return (
    <div className="dashboard-container">
      {/* Sidebar (20% width) */}
      <div className="sidebar">
        {user.avatar && <img src={user.avatar} alt="User Avatar" className="avatar" />}
        <h2>Welcome {user.name}!</h2>
      </div>

      {/* Main Content (80% width) */}
      <div className="main-content">
        {/* Filters Section */}
        <div className="filters-section">
          <label>Select Frequency:</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="Last Week">Last Week</option>
            <option value="Last Month">Last Month</option>
            <option value="Last Year">Last Year</option>
          </select>

          <label>Type:</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="savings">Savings</option>
          </select>

          <button onClick={resetAll} className="reset-button">
            Reset All
          </button>
        </div>

        {/* Add Transaction Section */}
        <div className="add-transaction-section">
          <h3>Add New Transaction</h3>
          <input
            type="date"
            name="date"
            value={newTransaction.date}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newTransaction.title}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={handleInputChange}
          />
          <label>Type:</label>
          <select name="type" value={newTransaction.type} onChange={handleInputChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="savings">Savings</option>
          </select>
          <label>Category:</label>
          <select name="category" value={newTransaction.category} onChange={handleInputChange}>
            <option value="Other">Other</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transport">Transport</option>
          </select>
          <button onClick={addTransaction} className="add-button">
            Done
          </button>
        </div>

        {/* Transactions Table */}
        <div className="transactions-section">
          <h3>Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn, index) => (
                  <tr key={index}>
                    <td>{txn.date}</td>
                    <td>{txn.title}</td>
                    <td>{txn.amount}</td>
                    <td>{txn.type}</td>
                    <td>{txn.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No transactions available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Insights Section */}
        <Insights
          incomePercentage={incomePercentage}
          expensePercentage={expensePercentage}
          savingsPercentage={savingsPercentage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
