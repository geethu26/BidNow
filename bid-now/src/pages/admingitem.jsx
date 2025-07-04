import React, { useState } from "react";
import AdminNavbar from "../components/adminnavbar";
import Footer from "../components/footer";

const AddItem = () => {
  const [newAuction, setNewAuction] = useState({
    title: "",
    category: "",
    image: "",
    startingBid: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setNewAuction({ ...newAuction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...newAuction,
      currentBid: parseFloat(newAuction.startingBid),
    };

    try {
      await fetch("http://localhost:5000/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      console.error("Error adding item:", err);
    }
  };

  return (
    <>
      <AdminNavbar username="Admin" />
      <div className="container mt-5 mb-5">
        <h3 className="mb-4">Add New Auction Item</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                name="title"
                className="form-control"
                placeholder="Title"
                value={newAuction.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                name="category"
                className="form-control"
                placeholder="Category"
                value={newAuction.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                name="image"
                className="form-control"
                placeholder="Image URL"
                value={newAuction.image}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                name="startingBid"
                className="form-control"
                placeholder="Starting Bid"
                value={newAuction.startingBid}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="datetime-local"
                name="endTime"
                className="form-control"
                value={newAuction.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button className="btn btn-success mt-4">Add Auction</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddItem;
