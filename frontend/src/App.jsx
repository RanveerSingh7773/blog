import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import CreateBlog from "./Createblog";
import Blogs from "./Blogs";
import"./allCss/navbar.css"



export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Save token on login hone par
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Logout hone par
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Router>

       <nav className="navbar">
      <Link className="nav-link" to="/register">Register</Link>
      <Link className="nav-link" to="/login">Login</Link>
      <Link className="nav-link" to="/blogs">All Blogs</Link>

      {token && (
        <Link className="nav-link" to="/create">Create Blog</Link>
      )}

      {token && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={handleLogin} />} />
        <Route path="/create" element={token ? <CreateBlog token={token} /> : <h2>Please Login</h2>} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/" element={<h2>Blog App</h2>} />
      </Routes>
    </Router>

  );
}




