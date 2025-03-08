// Updated Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };
  const navigate = useNavigate();

  //Login handling
  const handleLogin = async (e) => {
    e.preventDefault(); 
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Login failed");
        throw new Error(data.message || "Login failed");
      }
  
      console.log("Server Response:", data); // Debugging log
  
      if (data.token && data.user && !isTokenExpired(data.token)) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data properly
        console.log("Storing user data:", data.user); // Debugging log

      // Fetch transactions after login
      const transactionsResponse = await fetch("http://localhost:5000/api/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!transactionsResponse.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactionsData = await transactionsResponse.json();
      console.log("Fetched Transactions:", transactionsData)

        navigate("/dashboard");
      } else {
        setError("Session expired. Please log in again.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }    
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
