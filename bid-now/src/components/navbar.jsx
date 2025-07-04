import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("loggedInUser");
    if (storedName) {
      // Optional: Verify against /users if you want additional data
      setUsername(storedName);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("loggedInUserEmail");
      localStorage.removeItem("userRole");
      window.location.href = "/";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-gavel"></i> BidNow
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/live-auction">Live Auctions</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#categories">Categories</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">How It Works</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>

          {username ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-primary dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user me-1"></i> {username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="fas fa-user me-1"></i> Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/my-bids">
                    <i className="fas fa-gavel me-1"></i> My Bids
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/watchlist">
                    <i className="fas fa-heart me-1"></i> Watchlist
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/signup" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
