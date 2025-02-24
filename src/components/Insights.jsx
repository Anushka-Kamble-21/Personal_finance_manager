// Insights.jsx
import React from 'react';
import './Insights.css';

const Insights = ({ incomePercentage, expensePercentage, savingsPercentage }) => {
  return (
    <div className="insights-section">
      <h3>Insights</h3>
      <div className="progress-container">
        {/* Income Circular Progress Bar */}
        <div className="progress-circle">
          <div className="circle progress-income">
            <div className="circle-text">
              <span>Income</span>
              <br />
              <span>{incomePercentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Expense Circular Progress Bar */}
        <div className="progress-circle">
          <div className="circle progress-expense">
            <div className="circle-text">
              <span>Expense</span>
              <br />
              <span>{expensePercentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Savings Circular Progress Bar */}
        <div className="progress-circle">
          <div className="circle progress-savings">
            <div className="circle-text">
              <span>Savings</span>
              <br />
              <span>{savingsPercentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
