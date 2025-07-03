import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const MyBidsPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [bids, setBids] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      navigate("/login");
    } else {
      setUsername(user);
    }
  }, [navigate]);

  useEffect(() => {
    if (!username) return;
    fetch(`http://localhost:5000/bids?userEmail=${username}`)
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((bid) => ({
          ...bid,
          bidTime: new Date(bid.bidTime),
          endTime: new Date(bid.endTime),
        }));
        setBids(enriched);
      })
      .catch((err) => console.error("Failed to fetch bids:", err));
  }, [username]);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((val) => val + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const clearBid = async (bidId) => {
    await fetch(`http://localhost:5000/bids/${bidId}`, {
      method: "DELETE",
    });
    setBids((prev) => prev.filter((b) => b.id !== bidId));
  };

  const clearAllBids = async () => {
    if (window.confirm("Are you sure you want to clear all bids?")) {
      await Promise.all(
        bids.map((bid) =>
          fetch(`http://localhost:5000/bids/${bid.id}`, {
            method: "DELETE",
          })
        )
      );
      setBids([]);
    }
  };

  const updateBidStatus = (bid) => {
    const now = new Date();
    const auctionEnded = bid.endTime <= now;
    if (auctionEnded) {
      return bid.bidAmount >= bid.currentBid ? "won" : "lost";
    }
    return bid.bidAmount >= bid.currentBid ? "winning" : "outbid";
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const diff = endTime - now;
    if (diff <= 0) return "ENDED";
    const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
    const m = String(
      Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    ).padStart(2, "0");
    const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const filteredBids = bids
    .filter((bid) => {
      const status = updateBidStatus(bid);
      if (filter === "all") return true;
      if (filter === "active") return ["winning", "outbid"].includes(status);
      if (filter === "winning") return status === "winning";
      if (filter === "ended") return ["won", "lost"].includes(status);
      return true;
    })
    .filter((bid) => {
      const term = search.toLowerCase();
      return (
        bid.title.toLowerCase().includes(term) ||
        bid.category.toLowerCase().includes(term)
      );
    });

  const stats = {
    total: bids.length,
    active: bids.filter((bid) =>
      ["winning", "outbid"].includes(updateBidStatus(bid))
    ).length,
    winning: bids.filter((bid) => updateBidStatus(bid) === "winning").length,
    spent: bids
      .filter((bid) => updateBidStatus(bid) === "won")
      .reduce((acc, b) => acc + b.bidAmount, 0),
  };

  return (
    <>
      <Navbar username={username} />

      <section className="py-5 bg-light text-center">
        <div className="container">
          <h1 className="display-5 fw-bold">
            <i className="fas fa-gavel text-primary"></i> My Bids
          </h1>
          <p className="lead text-muted">
            Track all your auction bids in one place
          </p>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="row text-white">
            <StatCard label="Total Bids" value={stats.total} color="primary" />
            <StatCard
              label="Active Bids"
              value={stats.active}
              color="success"
            />
            <StatCard label="Winning" value={stats.winning} color="warning" />
            <StatCard
              label="Total Bid Amount"
              value={`$${stats.spent.toLocaleString()}`}
              color="info"
            />
          </div>
        </div>
      </section>

      <section className="py-3 bg-light">
        <div className="container d-md-flex justify-content-between align-items-center gap-3">
          <div className="btn-group mb-3">
            {["all", "active", "winning", "ended"].map((f) => (
              <button
                key={f}
                className={`btn btn-outline-primary ${
                  filter === f ? "active" : ""
                }`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="input-group mb-3" style={{ maxWidth: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search your bids..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
          </div>
          {bids.length > 0 && (
            <button
              className="btn btn-danger btn-sm mb-3"
              onClick={clearAllBids}
            >
              <i className="fas fa-trash me-1"></i> Clear All Bids
            </button>
          )}
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {filteredBids.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-gavel fa-5x text-muted mb-4"></i>
              <h3 className="text-muted">No Bids Placed Yet</h3>
              <p className="text-muted">
                Start bidding on items to see them here!
              </p>
              <a href="/live-auction" className="btn btn-primary">
                Browse Auctions
              </a>
            </div>
          ) : (
            <div className="row">
              {filteredBids.map((bid) => (
                <div className="col-md-6 col-lg-4 mb-4" key={bid.id}>
                  <BidCard
                    bid={bid}
                    formatTimeRemaining={formatTimeRemaining}
                    updateBidStatus={updateBidStatus}
                    clearBid={() => clearBid(bid.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="col-md-3 mb-3">
    <div className={`card text-center bg-${color} text-white`}>
      <div className="card-body">
        <h3 className="card-title">{value}</h3>
        <p className="card-text">{label}</p>
      </div>
    </div>
  </div>
);

const BidCard = ({ bid, formatTimeRemaining, updateBidStatus, clearBid }) => {
  const status = updateBidStatus(bid);
  const badgeMap = {
    winning: "success",
    outbid: "warning",
    won: "primary",
    lost: "danger",
  };

  return (
    <div
      className={`card auction-card border-${badgeMap[status] || "secondary"}`}
    >
      <img
        src={bid.image}
        alt={bid.title}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{bid.title}</h5>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-secondary">{bid.category}</span>
          <span className={`badge bg-${badgeMap[status] || "secondary"}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="row mb-2">
          <div className="col-6">
            <small className="text-muted">Your Bid</small>
            <div className="fw-bold text-primary">
              ${bid.bidAmount.toLocaleString()}
            </div>
          </div>
          <div className="col-6">
            <small className="text-muted">Current Bid</small>
            <div className="fw-bold text-success">
              ${bid.currentBid.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="mb-2">
          <small className="text-muted">Time Remaining</small>
          <div
            className={`fw-bold ${
              formatTimeRemaining(bid.endTime) === "ENDED"
                ? "text-danger"
                : "text-warning"
            }`}
          >
            {formatTimeRemaining(bid.endTime)}
          </div>
        </div>
        <div className="mb-2">
          <small className="text-muted">Bid Placed</small>
          <div className="small">
            {bid.bidTime.toLocaleDateString()}{" "}
            {bid.bidTime.toLocaleTimeString()}
          </div>
        </div>
        <div className="d-grid gap-2 mt-3">
          <a
            className="btn btn-outline-primary btn-sm"
            href={`/live-auction#auction-${bid.auctionId}`}
          >
            <i className="fas fa-eye"></i> View Auction
          </a>
          <button className="btn btn-danger btn-sm" onClick={clearBid}>
            <i className="fas fa-trash-alt me-1"></i> Clear Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBidsPage;
