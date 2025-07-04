import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import BidModal from "../components/bidmodal";

const WatchlistPage = () => {
  const [username, setUsername] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [, forceUpdate] = useState(0);

  // Redirect if not logged in and set username/email
  useEffect(() => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) {
      window.location.href = "/login";
    } else {
      setUsername(userEmail);
    }
  }, []);

  // Fetch all watchlist items, then filter client-side by userEmail
  useEffect(() => {
    if (!username) return;

    fetch("http://localhost:5000/watchlist")
      .then((res) => res.json())
      .then((data) => {
        const userEntries = data.filter(
          (entry) => entry.userEmail === username
        );
        const enriched = userEntries.map((entry) => ({
          ...entry,
          auction: {
            ...entry.auction,
            endTime: new Date(entry.auction.endTime),
          },
        }));
        setWatchlist(enriched);
      })
      .catch(console.error);
  }, [username]);

  // Force update every second for countdown
  useEffect(() => {
    const interval = setInterval(() => forceUpdate((v) => v + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const removeFromWatchlist = async (id) => {
    await fetch(`http://localhost:5000/watchlist/${id}`, {
      method: "DELETE",
    });
    setWatchlist((prev) => prev.filter((entry) => entry.id !== id));
  };

  const openBidModal = (auction) => {
    setSelectedAuction(auction);
    setShowBidModal(true);
  };

  const handleBidSuccess = async (bidAmount) => {
    if (!selectedAuction || !username) return;

    const bidPayload = {
      userEmail: username,
      auctionId: selectedAuction.id,
      title: selectedAuction.title,
      category: selectedAuction.category,
      image: selectedAuction.image,
      currentBid: bidAmount,
      bidAmount,
      endTime: selectedAuction.endTime.toISOString(),
      bidTime: new Date().toISOString(),
    };

    try {
      await fetch("http://localhost:5000/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bidPayload),
      });

      // Update currentBid locally in watchlist
      setWatchlist((prev) =>
        prev.map((entry) =>
          entry.auction.id === selectedAuction.id
            ? {
                ...entry,
                auction: {
                  ...entry.auction,
                  currentBid: bidAmount,
                  bids: (entry.auction.bids || 0) + 1,
                },
              }
            : entry
        )
      );

      setShowBidModal(false);
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid.");
    }
  };

  const formatCountdown = (end) => {
    if (!end || isNaN(new Date(end).getTime())) return "N/A";
    const diff = end - new Date();
    if (diff <= 0) return "ENDED";
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const filtered = watchlist.filter((entry) => {
    const term = search.toLowerCase();
    return (
      entry.auction.title.toLowerCase().includes(term) ||
      entry.auction.category.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Navbar />
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h1 className="display-5 fw-bold">
            <i className="fas fa-heart text-danger"></i> My Watchlist
          </h1>
          <p className="lead text-muted">
            Keep track of auctions you're eyeing
          </p>
        </div>
      </section>

      <section className="py-3 bg-white">
        <div className="container d-md-flex justify-content-between align-items-center gap-3">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search watchlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "300px" }}
          />
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-heart-broken fa-5x text-muted mb-4"></i>
              <h3 className="text-muted">No Items in Watchlist</h3>
              <p className="text-muted">Browse and add auctions you like</p>
              <a href="/live-auction" className="btn btn-primary">
                Browse Auctions
              </a>
            </div>
          ) : (
            <div className="row">
              {filtered.map((entry) => {
                const { auction } = entry;
                const countdown = formatCountdown(auction.endTime);
                return (
                  <div className="col-md-6 col-lg-4 mb-4" key={entry.id}>
                    <div className="card">
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
                            countdown === "ENDED"
                              ? "text-danger"
                              : "text-warning"
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
              })}
            </div>
          )}
        </div>
      </section>

      <BidModal
        show={showBidModal}
        onClose={() => setShowBidModal(false)}
        auction={selectedAuction}
        onBidSuccess={handleBidSuccess}
      />

      <Footer />
    </>
  );
};

export default WatchlistPage;
