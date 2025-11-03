import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

   const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={token ? <Dashboard onLogout={handleLogout}/> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
