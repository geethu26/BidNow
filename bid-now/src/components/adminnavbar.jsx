import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");
    if (storedName && role === "Admin") {
      setUsername(storedName);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("loggedInUserEmail");
      localStorage.removeItem("userRole");
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/admin">
          <i className="fas fa-tools me-2"></i>Admin Panel
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/users">
                Manage Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/auctions">
                Manage Auctions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/add">
                Add Item
              </Link>
            </li>
          </ul>

          {username && (
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="adminDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user me-1"></i> {username}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="adminDropdown"
              >
                <li>
                  <span className="dropdown-item-text fw-bold text-muted">
                    Admin
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
