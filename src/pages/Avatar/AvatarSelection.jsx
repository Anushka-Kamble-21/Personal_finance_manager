import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AvatarSelection.module.css"; // CSS for styling

const AvatarSelection = ({ setUser }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigate = useNavigate();

  // Dynamically generate avatar image paths
  const avatarList = Array.from({ length: 16 }, (_, i) => `/avatars/Avatar${i + 1}.png`);

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar); 
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      setUser((prevUser) => ({ ...prevUser, avatar: selectedAvatar }));
      navigate("/dashboard"); // Redirect to Dashboard
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
