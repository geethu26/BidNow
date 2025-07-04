import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../components/adminnavbar";
import Footer from "../components/footer";

const AdminHome = () => {
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState({ users: 0, auctions: 0, bids: 0 });

  useEffect(() => {
    const admin = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");

    if (role !== "Admin") {
      window.location.href = "/login";
      return;
    }

    setAdminName(admin);

    Promise.all([
      fetch("http://localhost:5000/users").then((res) => res.json()),
      fetch("http://localhost:5000/auctions").then((res) => res.json()),
      fetch("http://localhost:5000/bids").then((res) => res.json()),
    ]).then(([users, auctions, bids]) => {
      setStats({
        users: users.length,
        auctions: auctions.length,
        bids: bids.length,
      });
    });
  }, []);

  return (
    <>
      <AdminNavbar username={adminName || "Admin"} />
      <div className="container mt-5 mb-5">
        <h3 className="mb-3">Welcome back, {adminName}!</h3>
        <p className="text-muted">Here’s what’s happening in the system:</p>
        <div className="row mb-4">
          {["users", "auctions", "bids"].map((key) => (
            <div className="col-md-4 mb-3" key={key}>
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-capitalize">{key}</h5>
                  <h2 className="text-primary">{stats[key]}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex gap-3">
          <Link to="/admin/add" className="btn btn-success">
            Add Item
          </Link>
          <Link to="/admin/users" className="btn btn-primary">
            Manage Users
          </Link>
          <Link to="/admin/auctions" className="btn btn-warning">
            Manage Auctions
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminHome;
