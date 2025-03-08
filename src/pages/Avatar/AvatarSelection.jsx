import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AvatarSelection.module.css"; // CSS for styling

const AvatarSelection = ({ setUser }) => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  // Dynamically generate avatar image paths
  const avatarList = Array.from({ length: 16 }, (_, i) => `/avatars/Avatar${i + 1}.png`);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setSelectedAvatar(userData.avatar || "/avatars/default.png");
    }
  }, []);

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirm = async () => {
    if (selectedAvatar) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch("http://localhost:5000/api/auth/update-avatar", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: selectedAvatar }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        // Fetch user from localStorage and update it properly
        const storedUser = localStorage.getItem("user");
        const updatedUser = storedUser ? { ...JSON.parse(storedUser), avatar: selectedAvatar } : { avatar: selectedAvatar };

        // Save updated user to localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update state and navigate to dashboard
        setUser(updatedUser);
        // Navigate to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Error updating avatar:", error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Your Avatar</h2>
      <div className={styles.avatarGrid}>
        {avatarList.map((avatar, index) => (
          <div 
            key={index} 
            className={`${styles.avatarWrapper} ${selectedAvatar === avatar ? styles.selected : ""}`} 
            onClick={() => handleSelect(avatar)}
          >
            <img
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={styles.avatar}
            />
          </div>
        ))}
      </div>
      <button 
        onClick={handleConfirm} 
        disabled={!selectedAvatar} 
        className={selectedAvatar ? styles.confirmButton : styles.disabledButton}
      >
        Confirm Selection
      </button>
    </div> 
  );
};

export default AvatarSelection;