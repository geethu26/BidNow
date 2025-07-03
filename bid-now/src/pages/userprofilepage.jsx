import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import BidModal from "../components/bidmodal";
import userImage from "../img/user.png"; // Default local user image

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: userImage, // Default image initially
  });

  const [bids, setBids] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    if (!loggedInUserEmail) {
      window.location.href = "/login";
      return;
    }

    // Fetch user info and merge with default image
    fetch(`http://localhost:5000/users?email=${loggedInUserEmail}`)
      .then((res) => res.json())
      .then((users) => {
        if (users.length > 0) {
          setUser((prevUser) => ({
            ...prevUser,
            ...users[0],
            image: users[0].image || prevUser.image, // keep default if missing
          }));
        }
      })
      .catch(console.error);

    // Fetch bids for user
    fetch(`http://localhost:5000/bids?userEmail=${loggedInUserEmail}`)
      .then((res) => res.json())
      .then((bidsData) => {
        const enrichedBids = bidsData.map((bid) => ({
          ...bid,
          endTime: new Date(bid.endTime),
        }));
        setBids(enrichedBids);
      })
      .catch(console.error);

    // Fetch watchlist for user
    fetch(`http://localhost:5000/watchlist?userEmail=${loggedInUserEmail}`)
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
      .catch(console.error);

    // Dummy recent activity
    setRecentActivity([
      "Bid placed on Vintage Rolex Submariner",
      "Added Vintage Rolex Submariner to watchlist",
      "Updated profile details",
    ]);
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save user changes to backend if needed
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
      alert("Failed to remove item from watchlist.");
    }
  };

  const formatCountdown = (end) => {
    if (!end) return "N/A";
    const diff = end - new Date();
    if (diff <= 0) return "ENDED";
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <>
      <Navbar username={user.name || user.email} />

      <div className="container mt-5 mb-5">
        {/* Profile Card */}
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
                <h4>{user.name || "User"}</h4>
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

        {/* Bids Section */}
        <h5 className="mt-5">Your Bids</h5>
        <div className="row">
          {bids.length > 0 ? (
            bids.map((bid) => {
              const countdown = formatCountdown(bid.endTime);

              return (
                <div className="col-md-6 col-lg-4 mb-4" key={bid.id}>
                  <div className="card h-100 shadow-sm auction-card visible">
                    <img
                      src={bid.image}
                      className="card-img-top"
                      alt={bid.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{bid.title}</h5>
                      <span className="badge bg-secondary mb-2">
                        {bid.category}
                      </span>
                      <div className="mb-2 text-success fw-bold">
                        Current Bid: ${bid.currentBid.toLocaleString()}
                      </div>
                      <div
                        className={
                          countdown === "ENDED" ? "text-danger" : "text-warning"
                        }
                      >
                        Time Left: {countdown}
                      </div>
                      <div className="mb-2">
                        <strong>Your Bid:</strong> $
                        {bid.bidAmount.toLocaleString()}
                      </div>
                      <div className="d-grid gap-2 mt-3">
                        {countdown !== "ENDED" && (
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted">You haven't placed any bids yet.</p>
          )}
        </div>

        {/* Watchlist Section */}
        <h5 className="mt-5">Watchlist</h5>
        <div className="row">
          {watchlist.length > 0 ? (
            watchlist.map((entry) => {
              const { auction } = entry;
              const countdown = formatCountdown(auction.endTime);

              return (
                <div className="col-md-6 col-lg-4 mb-4" key={entry.id}>
                  <div className="card h-100 shadow-sm auction-card visible">
                    <img
                      src={auction.image}
                      className="card-img-top"
                      alt={auction.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{auction.title}</h5>
                      <span className="badge bg-secondary mb-2">
                        {auction.category}
                      </span>
                      <div className="mb-2 text-success fw-bold">
                        Current Bid: ${auction.currentBid.toLocaleString()}
                      </div>
                      <div
                        className={
                          countdown === "ENDED" ? "text-danger" : "text-warning"
                        }
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
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, i) => (
              <li className="list-group-item" key={i}>
                {activity}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No recent activity.</li>
          )}
        </ul>
      </div>

      <BidModal
        show={showBidModal}
        auction={selectedAuction}
        onClose={() => setShowBidModal(false)}
        onBidSuccess={() => setShowBidModal(false)}
      />

      <Footer />
    </>
  );
};

export default UserProfile;
