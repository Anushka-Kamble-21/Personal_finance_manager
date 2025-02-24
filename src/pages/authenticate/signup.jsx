import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import styles from "./signup.module.css"; 

const Signup = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Redirect to avatar selection after a short delay
    setTimeout(() => {
      navigate("/avatar-selection");
    }, 1000);
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
            <button type="submit" className={styles.signupBtn}>Sign Up</button>
          </form>
        ) : (
          <p className={styles.successMessage}>🎉 Congrats! You are a user. 🎉</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
