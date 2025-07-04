import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/adminnavbar";

const ManageAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    currentBid: "",
    endTime: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/auctions")
      .then((res) => res.json())
      .then((data) => setAuctions(data));
  }, []);

  const deleteAuction = async (id) => {
    if (!window.confirm("Delete this auction?")) return;
    await fetch(`http://localhost:5000/auctions/${id}`, { method: "DELETE" });
    setAuctions((prev) => prev.filter((a) => a.id !== id));
  };

  const startEditing = (auction) => {
    setEditingId(auction.id);
    setEditForm({
      title: auction.title,
      category: auction.category,
      currentBid: auction.currentBid,
      endTime: auction.endTime.slice(0, 16), // for input[type=datetime-local]
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "currentBid" ? Number(value) : value,
    }));
  };

  const saveEdit = async () => {
    const updatedAuction = {
      ...editForm,
      endTime: new Date(editForm.endTime).toISOString(),
    };

    try {
      const res = await fetch(`http://localhost:5000/auctions/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAuction),
      });
      if (!res.ok) throw new Error("Failed to update");

      setAuctions((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...updatedAuction } : a))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <h4>Manage Auctions</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Current Bid</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) =>
              editingId === auction.id ? (
                <tr key={auction.id}>
                  <td>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="currentBid"
                      value={editForm.currentBid}
                      onChange={handleChange}
                      className="form-control"
                      min={0}
                    />
                  </td>
                  <td>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={editForm.endTime}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={auction.id}>
                  <td>{auction.title}</td>
                  <td>{auction.category}</td>
                  <td>₹{auction.currentBid}</td>
                  <td>{new Date(auction.endTime).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => startEditing(auction)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteAuction(auction.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAuctions;
