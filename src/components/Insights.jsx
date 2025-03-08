import "./Insights.css";
const Insights = ({ incomePercentage, expensePercentage, savingsPercentage, typeFilter }) => {
  return (
    <div className="insights-popup">
      <h3>Insights</h3>
      <div className="progress-container">
        {/* Income Progress Bar */}
        {(typeFilter === "All" || typeFilter === "income") && (
          <div className="progress-bar-container">
            <div className="progress-label">Income</div>
            <div className="progress-bar progress-income">
              <div
                className="progress-bar-fill"
                style={{ width: `${incomePercentage}%` }}
              ></div>
              <div className="progress-percentage">
                {incomePercentage.toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Expense Progress Bar */}
        {(typeFilter === "All" || typeFilter === "expense") && (
          <div className="progress-bar-container">
            <div className="progress-label">Expense</div>
            <div className="progress-bar progress-expense">
              <div
                className="progress-bar-fill"
                style={{ width: `${expensePercentage}%` }}
              ></div>
              <div className="progress-percentage">
                {expensePercentage.toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Savings Progress Bar */}
        {(typeFilter === "All" || typeFilter === "savings") && (
          <div className="progress-bar-container">
            <div className="progress-label">Savings</div>
            <div className="progress-bar progress-savings">
              <div
                className="progress-bar-fill"
                style={{ width: `${savingsPercentage}%` }}
              ></div>
              <div className="progress-percentage">
                {savingsPercentage.toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;