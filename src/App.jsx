import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/authenticate/home";
import Login from "./pages/authenticate/login";
import Signup from "./pages/authenticate/signup";
import AvatarSelection from "./pages/avatar/AvatarSelection";
import Dashboard from "./pages/home/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { name: "", avatar: "" };
  });

  // Save user to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/avatar-selection" element={<AvatarSelection setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
