import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import BidModal from "../components/bidmodal";
import userImage from "../img/user.png"; // Default image

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: userImage,
  });

  const [bids, setBids] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const userEmail = localStorage.getItem("loggedInUserEmail")
    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Fetch user info
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((users) => {
        console.log(userEmail)
        const matchedUser = users.find(
          (u) => u.email.toLowerCase() === userEmail.toLowerCase()
        );
        if (matchedUser) {
          console.log(matchedUser)
          setUser((prev) => ({
            ...prev,
            ...matchedUser,
            image: matchedUser.image || prev.image,
          }));
        } else {
          console.warn("No user matched the given email.");
        }
      })
      .catch((err) => {
        console.error("Error fetching user info:", err);
      });

    // Fetch bids for this user
    fetch(
      `http://localhost:5000/bids?userEmail=${encodeURIComponent(user)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((bid) => ({
          ...bid,
          endTime: new Date(bid.endTime),
        }));
        setBids(enriched);
      })
      .catch((err) => {
        console.error("Error fetching bids:", err);
      });

    // Fetch watchlist for this user
    fetch(
      `http://localhost:5000/watchlist?userEmail=${encodeURIComponent(
        user
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((entry) => ({
          ...entry,
          auction: {
            ...entry.auction,
            endTime: new Date(entry.auction.endTime),
          },
        }));
        setWatchlist(enriched);
      })
      .catch((err) => {
        console.error("Error fetching watchlist:", err);
      });

    // Mock recent activity
    setRecentActivity([
      "Bid placed on Vintage Rolex Submariner",
      "Added BMW M3 to watchlist",
      "Updated profile picture",
    ]);
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) =>
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implement user update logic if desired
  };

  const openBidModal = (auction) => {
    setSelectedAuction(auction);
    setShowBidModal(true);
  };

  const removeFromWatchlist = async (id) => {
    try {
      await fetch(`http://localhost:5000/watchlist/${id}`, {
        method: "DELETE",
      });
      setWatchlist((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove from watchlist.");
    }
  };

  const formatCountdown = (endTime) => {
    if (!(endTime instanceof Date)) return "N/A";
    const now = new Date();
    const diff = endTime - now;
    if (diff <= 0) return "ENDED";
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <>
      <Navbar username={user.name || "User"} />

      <div className="container mt-5 mb-5">
        {/* Profile */}
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <img
              src={user.image}
              alt="User"
              className="rounded-circle mb-3"
              width="120"
            />
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  className="form-control mb-2"
                  value={user.name}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  className="form-control mb-3"
                  value={user.email}
                  onChange={handleInputChange}
                  disabled // usually you don't want to edit email
                />
                <button className="btn btn-success me-2" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleEditToggle}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bids */}
        <h5 className="mt-5">Your Bids</h5>
        <div className="row">
          {bids.length ? (
            bids.map((bid) => {
              const countdown = formatCountdown(bid.endTime);
              return (
                <div className="col-md-6 col-lg-4 mb-4" key={bid.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={bid.image}
                      alt={bid.title}
                      className="card-img-top"
                      style={{ height: 200, objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5>{bid.title}</h5>
                      <span className="badge bg-secondary">{bid.category}</span>
                      <div className="text-success fw-bold my-2">
                        Current Bid: ${bid.currentBid.toLocaleString()}
                      </div>
                      <div
                        className={`fw-bold ${
                          countdown === "ENDED" ? "text-danger" : "text-warning"
                        }`}
                      >
                        Time Left: {countdown}
                      </div>
                      <div className="mt-2">
                        <strong>Your Bid:</strong> $
                        {bid.bidAmount.toLocaleString()}
                      </div>
                      {countdown !== "ENDED" && (
                        <div className="d-grid gap-2 mt-3">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              openBidModal({
                                id: bid.auctionId,
                                title: bid.title,
                                image: bid.image,
                                currentBid: bid.currentBid,
                                endTime: bid.endTime,
                                category: bid.category,
                              })
                            }
                          >
                            <i className="fas fa-gavel"></i> Place Bid
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted">You haven't placed any bids yet.</p>
          )}
        </div>

        {/* Watchlist */}
        <h5 className="mt-5">Watchlist</h5>
        <div className="row">
          {watchlist.length ? (
            watchlist.map((entry) => {
              const { auction } = entry;
              const countdown = formatCountdown(auction.endTime);
              return (
                <div className="col-md-6 col-lg-4 mb-4" key={entry.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="card-img-top"
                      style={{ height: 200, objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5>{auction.title}</h5>
                      <span className="badge bg-secondary">
                        {auction.category}
                      </span>
                      <div className="text-success fw-bold my-2">
                        Current Bid: ${auction.currentBid.toLocaleString()}
                      </div>
                      <div
                        className={`fw-bold ${
                          countdown === "ENDED" ? "text-danger" : "text-warning"
                        }`}
                      >
                        Time Left: {countdown}
                      </div>
                      <div className="d-grid gap-2 mt-3">
                        {countdown !== "ENDED" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openBidModal(auction)}
                          >
                            <i className="fas fa-gavel"></i> Place Bid
                          </button>
                        )}
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromWatchlist(entry.id)}
                        >
                          <i className="fas fa-trash-alt"></i> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted">No items in watchlist.</p>
          )}
        </div>

        {/* Recent Activity */}
        <h5 className="mt-5">Recent Activity</h5>
        <ul className="list-group">
          {recentActivity.map((activity, idx) => (
            <li key={idx} className="list-group-item">
              {activity}
            </li>
          ))}
        </ul>
      </div>

      <BidModal
        show={showBidModal}
        onClose={() => setShowBidModal(false)}
        auction={selectedAuction}
        onBidSuccess={() => setShowBidModal(false)}
      />

      <Footer />
    </>
  );
};

export default UserProfile;
