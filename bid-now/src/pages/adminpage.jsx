import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/adminnavbar";
import Footer from "../components/footer";

const AdminProfile = () => {
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState({ users: 0, auctions: 0, bids: 0 });
  const [users, setUsers] = useState([]);
  const [newAuction, setNewAuction] = useState({
    title: "",
    category: "",
    image: "",
    startingBid: "",
    endTime: "",
  });

  useEffect(() => {
    const admin = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");

    if (role !== "Admin") {
      window.location.href = "/login";
      return;
    }

    setAdminName(admin);

    // Fetch stats
    Promise.all([
      fetch("http://localhost:5000/users").then((res) => res.json()),
      fetch("http://localhost:5000/auctions").then((res) => res.json()),
      fetch("http://localhost:5000/bids").then((res) => res.json()),
    ])
      .then(([usersData, auctionsData, bidsData]) => {
        setUsers(usersData);
        setStats({
          users: usersData.length,
          auctions: auctionsData.length,
          bids: bidsData.length,
        });
      })
      .catch((err) => console.error("Error fetching admin data:", err));
  }, []);

  const handleInputChange = (e) => {
    setNewAuction({ ...newAuction, [e.target.name]: e.target.value });
  };

  const handleAddAuction = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAuction,
          currentBid: parseFloat(newAuction.startingBid),
        }),
      });
      alert("Auction item added!");
      setNewAuction({
        title: "",
        category: "",
        image: "",
        startingBid: "",
        endTime: "",
      });
    } catch (err) {
      console.error("Error adding auction:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <>
      <AdminNavbar username={adminName || "Admin"} />
      <div className="container mt-5 mb-5">
        <h3 className="mb-4">Admin Dashboard</h3>

        {/* Stats */}
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

        {/* Add Auction */}
        <div className="card mb-5 shadow-sm">
          <div className="card-header">Add New Auction Item</div>
          <div className="card-body">
            <form onSubmit={handleAddAuction}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Title"
                    required
                    value={newAuction.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    placeholder="Category"
                    required
                    value={newAuction.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    placeholder="Image URL"
                    required
                    value={newAuction.image}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="startingBid"
                    className="form-control"
                    placeholder="Starting Bid"
                    required
                    value={newAuction.startingBid}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="datetime-local"
                    name="endTime"
                    className="form-control"
                    required
                    value={newAuction.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button className="btn btn-success mt-3">Add Item</button>
            </form>
          </div>
        </div>

        {/* Manage Users */}
        <h5>Manage Users</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminProfile;
