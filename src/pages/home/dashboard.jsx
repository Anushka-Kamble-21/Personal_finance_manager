import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import Insights from "../../components/Insights";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/auth";

const Dashboard = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const tableBodyRef = useRef(null); // Ref for the table body
  const [typeFilter, setTypeFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    title: "",
    amount: "",
    type: "income",
    category: "Education",
  });
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [insights, setInsights] = useState({
    incomePercentage: 0,
    expensePercentage: 0,
    savingsPercentage: 0,
  });
  const [showInsights, setShowInsights] = useState(false);

  const navigate = useNavigate();

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const calculateInsights = (transactions) => {
    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavings = 0;

    transactions.forEach((txn) => {
      if (txn.type === "income") {
        totalIncome += txn.amount;
      } else if (txn.type === "expense") {
        totalExpense += txn.amount;
      } else if (txn.type === "savings") {
        totalSavings += txn.amount;
      }
    });

    const totalAmount = totalIncome + totalExpense + totalSavings;

    const incomePercentage = totalAmount > 0 ? (totalIncome / totalAmount) * 100 : 0;
    const expensePercentage = totalAmount > 0 ? (totalExpense / totalAmount) * 100 : 0;
    const savingsPercentage = totalAmount > 0 ? (totalSavings / totalAmount) * 100 : 0;

    return { incomePercentage, expensePercentage, savingsPercentage };
  }; 

  // Define resetFilters function
  const resetFilters = () => {
    setStartDate(""); // Reset start date
    setEndDate(""); // Reset end date
    setTypeFilter("All"); // Reset type filter to "All"
    fetchTransactions(); // Fetch all transactions again (optional)
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
          handleLogout();
          return;
        }

        const storedUser = localStorage.getItem("user");
        const userData = storedUser ? JSON.parse(storedUser) : null;

        if (!userData || !userData._id) {
          throw new Error("User ID not found in localStorage");
        }

        setUser({
          userId: userData._id,
          name: userData.name || "Unknown",
          avatar: userData.avatar || "/avatars/default.png",
        });

        // Fetch transactions after setting user data
        fetchTransactions();
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        handleLogout();
      }
    };

    fetchUserData();
  }, [setUser]);

  // Auto-scroll to the bottom of the table when transactions change
  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched transactions:", data); // Debug log
      setTransactions(data);

      // Calculate insights
      const { incomePercentage, expensePercentage, savingsPercentage } =
        calculateInsights(data);
        console.log("Calculated insights:", { incomePercentage, expensePercentage, savingsPercentage }); // Debug log
      setInsights({ incomePercentage, expensePercentage, savingsPercentage });
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    }
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.title || !newTransaction.amount) {
      alert("Title and Amount are required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const transactionData = {
      ...newTransaction,
      userId: user._id,
    };

    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      console.log("Transaction added:", data);

      setNewTransaction({
        date: "",
        title: "",
        amount: "",
        type: "income",
        category: "Education",
      });
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(`Failed to add transaction: ${error.message}`);
    }
  };

  const handleUpdateTransaction = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/transactions/${transactionToEdit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transactionToEdit),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      console.log("Transaction updated:", data);

      fetchTransactions();
      setIsEditFormOpen(false);
      setTransactionToEdit(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert(`Failed to update transaction: ${error.message}`);
    }
  };

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    setIsEditFormOpen(true);
  };

  const handleDeleteTransaction = async (id) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting transaction: ${response.status} - ${errorText}`);
      }
  
      // Fetch transactions again to update the list
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert(`Failed to delete transaction: ${error.message}`);
    }
  };
  const filterTransactions = (transactions) => {
    return transactions.filter((txn) => {
      // Filter by type
      const typeMatch = typeFilter === "All" || txn.type === typeFilter;
  
      // Filter by date range
      const txnDate = new Date(txn.date);
      const startDateMatch = startDate ? txnDate >= new Date(startDate) : true;
      const endDateMatch = endDate ? txnDate <= new Date(endDate) : true;
  
      return typeMatch && startDateMatch && endDateMatch;
    });
  }; 

const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

const handleDeleteAccount = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("User not authenticated. Please log in.");
    return;
  }

  // Confirmation before deleting account
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );

  if (!confirmDelete) {
    return; // Exit if the user cancels
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/delete-account", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error deleting account: ${errorText}`);
    }

    // Clear local storage and redirect to login page
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Your account has been deleted successfully.");
    navigate("/login");
  } catch (error) {
    // Improved error logging
    console.error("Error deleting account:", {
      message: error.message,
      stack: error.stack,
      response: error.response, // If it's an HTTP error
    });
    alert(`Failed to delete account: ${error.message}`);
  }
};

// In the JSX
{showDeleteConfirmation && (
  <div className="confirmation-modal">
    <div className="modal-content">
      <h3>Are you sure you want to delete your account?</h3>
      <p>This action cannot be undone.</p>
      <div className="modal-buttons">
        <button onClick={handleDeleteAccount}>Yes, Delete My Account</button>
        <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

// Update the Delete Account button
<button onClick={() => setShowDeleteConfirmation(true)} className="delete-account-button">
  Delete Account
</button>

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-section">
          <img
            src={user?.avatar || "/avatars/default.png"}
            alt="User Avatar"
            className="avatar"
          />
          <h2>Welcome {user?.name.split(" ")[0]}!</h2>
        </div>
        <button
          onClick={() => navigate("/avatar-selection")}
          className="avatar-button"
        >
          Update Avatar
        </button>
        <button onClick={() => setShowInsights(!showInsights)} className="insights-button">
          Insights
        </button>
        {/* Add Delete Account Button */}
        <button onClick={handleDeleteAccount} className="delete-account-button">
        Delete Account
        </button>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="main-content">
      <div className="filters-section">
  {/* Start Date */}
  <div className="filter-group">
    <label>Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
  </div>

  {/* End Date */}
  <div className="filter-group">
    <label>End Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>

  {/* Type Filter */}
  <div className="filter-group">
    <label>Type</label>
    <select
      value={typeFilter}
      onChange={(e) => setTypeFilter(e.target.value)}
    >
      <option value="All">All</option>
      <option value="income">Income</option>
      <option value="expense">Expense</option>
      <option value="savings">Savings</option>
    </select>
  </div>

  {/* Reset Filters Button */}
  <button className="reset-button" onClick={resetFilters}>
    Reset Filters
  </button>

</div>

        <div className="add-transaction-section">
          <h3>Add New Transaction</h3>
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Title"
            value={newTransaction.title}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, title: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
          />
          <label htmlFor="type" class="white-label">Type:</label>
          <select
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="savings">Savings</option>
          </select>

          <label htmlFor="category" class="white-label">Category:</label>
          <select
            value={newTransaction.category}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
          >
            <option value="Education">Education</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={handleAddTransaction}>Add Transaction</button>
        </div>

        {isEditFormOpen && (
  <div className="edit-transaction-overlay">
    <div className="edit-transaction-form">
      <h3>Edit Transaction</h3>
      <div className="form-fields">
        <input
          type="date"
          value={transactionToEdit?.date || ""}
          onChange={(e) =>
            setTransactionToEdit({
              ...transactionToEdit,
              date: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="Title"
          value={transactionToEdit?.title || ""}
          onChange={(e) =>
            setTransactionToEdit({
              ...transactionToEdit,
              title: e.target.value,
            })
          }
        />
        <input
          type="number"
          placeholder="Amount"
          value={transactionToEdit?.amount || ""}
          onChange={(e) =>
            setTransactionToEdit({
              ...transactionToEdit,
              amount: e.target.value,
            })
          }
        />
        <select
          value={transactionToEdit?.type || "income"}
          onChange={(e) =>
            setTransactionToEdit({
              ...transactionToEdit,
              type: e.target.value,
            })
          }
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="savings">Savings</option>
        </select>
        <select
          value={transactionToEdit?.category || "Education"}
          onChange={(e) =>
            setTransactionToEdit({
              ...transactionToEdit,
              category: e.target.value,
            })
          }
        >
          <option value="Education">Education</option>
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Travel">Travel</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-buttons">
        <button onClick={handleUpdateTransaction}>Update Transaction</button>
        <button onClick={() => setIsEditFormOpen(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

        <div className="transactions-section">
          <h4>Your Transactions:</h4>
          <div className="table-wrapper">
            <table border="1">
              <thead>
                <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Actions</th>
                </tr>
              </thead>
              <tbody ref={tableBodyRef}>
              {filterTransactions(transactions).map((txn) => (
              <tr key={txn._id}>
                <td>{formatDate(txn.date)}</td>
                <td>{txn.title}</td>
                <td>{txn.amount}</td>
                <td>{txn.type}</td>
                <td>{txn.category}</td>
                <td>
              <button onClick={() => handleEditTransaction(txn)}>Edit</button>
              <button onClick={() => handleDeleteTransaction(txn._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        
        {/* Insights Popup */}
        {showInsights && (
          <>
            {/* Backdrop Overlay */}
            <div className="backdrop" onClick={() => setShowInsights(false)}></div>

            {/* Insights Popup */}
            <div className="insights-popup">
              <Insights
                incomePercentage={insights.incomePercentage}
                expensePercentage={insights.expensePercentage}
                savingsPercentage={insights.savingsPercentage}
                typeFilter={typeFilter}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;