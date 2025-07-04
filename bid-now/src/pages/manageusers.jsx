import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/adminnavbar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/users").then((res) => res.json()),
      fetch("http://localhost:5000/bids").then((res) => res.json()),
    ])
      .then(([usersData, bidsData]) => {
        setUsers(usersData);
        setBids(bidsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getUserBids = (email) => {
    return bids.filter(
      (bid) =>
        bid.userEmail?.trim().toLowerCase() === email.trim().toLowerCase()
    );
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5 mb-5">
        <h3 className="mb-4">Manage Users</h3>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Bids Placed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  
                  const userBids = getUserBids(user.name);
                  
                  return (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {userBids.length > 0 ? (
                          <ul className="mb-0 ps-3">
                            {userBids.map((bid) => (
                              <li key={bid.id}>
                                <strong>{bid.title}</strong> – ₹{bid.bidAmount}
                                <br />
                                <small className="text-muted">
                                  {new Date(bid.bidTime).toLocaleString()}
                                </small>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted">No bids</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
