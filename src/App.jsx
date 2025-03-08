import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/authenticate/home";
import Login from "./pages/authenticate/login";
import Signup from "./pages/authenticate/signup";
import AvatarSelection from "./pages/avatar/AvatarSelection";
import Dashboard from "./pages/home/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import { isTokenExpired } from "./utils/auth"; // Import the utility function

function App() {
  const [user, setUser] = useState(() => {
    const storedData = localStorage.getItem("user");
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token || isTokenExpired(token)) {
      setUser(null);
      localStorage.removeItem("user");
      return;
    }
  
    fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("user");
      });
  }, [localStorage.getItem("token")]); // Watch for changes in token

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login user={user} setUser={setUser}/>} />
        <Route path="/signup" element={<Signup user={user} setUser={setUser}/>} />
        <Route path="/avatar-selection" element={<AvatarSelection setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
