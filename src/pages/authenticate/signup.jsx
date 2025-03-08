import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./signup.module.css";

const Signup = ({ setUser }) => { // Accept setUser as a prop
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(""); // Initialize error state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Parse the response
      console.log("Backend Response:", data); // Debug log

      if (response.ok) {
        // Save token and user data to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update user state using setUser
        setUser(data.user);

        alert("Signup Successful! Please select an avatar.");
        navigate("/avatar-selection"); // Redirect to the avatar selection page
      } else {
        setError(data.message || "Signup Failed"); // Set error message
        alert(data.message || "Signup Failed"); // Show error message
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred"); // Set error message
      alert("An error occurred"); // Show error message
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h1 className={styles.heading}>Sign Up</h1>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
            <input
              type="tel"
              name="contact"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
            <button type="submit" className={styles.signupBtn}>
              Sign Up
            </button>
          </form>
        ) : (
          <p className={styles.successMessage}>🎉 Congrats! You are a user. 🎉</p>
        )}

        {/* Display error message if there's an error */}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default Signup;