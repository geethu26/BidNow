import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AuctionCard from "../components/auctioncard";
import BidModal from "../components/bidmodal";

const LiveAuctionPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState("");
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const pageSize = 6;
  const sentinelRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/watchlist")
      .then((res) => res.json())
      .then((data) => setWatchlist(data))
      .catch((err) => console.error("Failed to fetch watchlist:", err));
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      alert("Login required to access auctions");
      window.location.href = "/login";
    } else {
      setUsername(loggedInUser);
    }

    fetch("http://localhost:5000/auctions")
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((a) => ({
          ...a,
          endTime: new Date(a.endTime),
        }));
        setAuctions(parsed);
        setFiltered(parsed);
      })
      .catch((err) => {
        console.error("Failed to fetch auction data:", err);
      });
  }, []);

  useEffect(() => {
    const list = auctions.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || item.category === category;
      return matchSearch && matchCat;
    });
    setFiltered(list);
    setPage(1);
  }, [search, category, auctions]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && page * pageSize < filtered.length) {
        setPage((p) => p + 1);
      }
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filtered, page]);

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceUpdate((v) => v + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceBid = (auction) => {
    setSelectedAuction(auction);
    setShowBidModal(true);
  };

  const addToWatchlist = async (auction) => {
    try {
      // Prevent duplicate entries for this user
      if (
        watchlist.find(
          (item) =>
            item.userEmail === username && item.auction?.id === auction.id
        )
      ) {
        alert("This auction is already in your watchlist.");
        return;
      }

      const newEntry = {
        userEmail: username,
        auction: {
          ...auction,
          endTime: auction.endTime.toISOString(), // store as string
        },
      };

      const response = await fetch("http://localhost:5000/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) throw new Error("Failed to add to watchlist");

      const newWatchItem = await response.json();
      setWatchlist((prev) => [...prev, newWatchItem]);
      alert("Added to watchlist!");
    } catch (error) {
      console.error(error);
      alert("Could not add to watchlist. Please try again.");
    }
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
      // Store the bid in the hosted db.json API
      await fetch("http://localhost:5000/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bidPayload),
      });

      // Update current auction state
      setAuctions((prev) =>
        prev.map((a) =>
          a.id === selectedAuction.id
            ? { ...a, currentBid: bidAmount, bids: a.bids + 1 }
            : a
        )
      );
    } catch (err) {
      console.error("Error submitting bid:", err);
      alert("Failed to submit bid.");
    }
  };

  const formatCountdown = (end) => {
    if (!end || isNaN(new Date(end).getTime())) return "N/A";

    const diff = new Date(end) - new Date();
    if (diff <= 0) return "ENDED";

    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const visibleAuctions = filtered.slice(0, page * pageSize);
  const categories = [...new Set(auctions.map((a) => a.category))];

  return (
    <>
      <Navbar username={username} />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2>
              <span className="text-danger me-2">●</span>Live Auctions
            </h2>
            <p className="lead">Don't miss out on these hot items!</p>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search auctions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            {visibleAuctions.map((a) => {
              const countdown = formatCountdown(a.endTime);
              return (
                <div className="col-lg-4 col-md-6 mb-4" key={a.id}>
                  <AuctionCard
                    auction={a}
                    countdown={countdown}
                    onPlaceBid={handlePlaceBid}
                    onAddToWatchlist={addToWatchlist}
                  />
                </div>
              );
            })}
          </div>

          <div
            ref={sentinelRef}
            className="text-center my-4"
            style={{ height: "1px" }}
          ></div>
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

export default LiveAuctionPage;
