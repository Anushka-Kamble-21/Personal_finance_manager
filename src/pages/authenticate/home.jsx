import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Welcome to Personal Finance Manager!</h1>
        
        <Link to="/signup">
          <button className={styles.signupBtn}>Sign Up</button>
        </Link>
        <p className={styles.loginText}>
          Already a user? <Link to="/login" className={styles.loginLink}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Home;
