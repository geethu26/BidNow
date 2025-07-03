import React from "react";

const AuctionCard = ({ auction, onPlaceBid, countdown, onAddToWatchlist }) => {
  
  const auctionEnded = new Date() > new Date(auction.endTime);

  return (
    <div className="card auction-card visible">
      <img
        src={auction.image}
        alt={auction.title}
        className="card-img-top"
        style={{ height: "250px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{auction.title}</h5>
        <div className="d-flex justify-content-between mb-2">
          <span className="badge bg-secondary">{auction.category}</span>
          <small className="text-muted">{auction.bids} bids</small>
        </div>
        <div className="bid-amount fw-bold">
          ${auction.currentBid.toLocaleString()}
        </div>
        <div className="countdown-timer text-muted my-2">
          <i className="fas fa-clock me-1"></i>
          <span className="time-display">{countdown}</span>
        </div>
        <div className="d-grid gap-2">
          <button
            className="btn btn-primary btn-custom"
            onClick={() => onPlaceBid(auction)}
            disabled={auctionEnded}
          >
            <i className="fas fa-gavel me-1"></i>
            {auctionEnded ? "Auction Ended" : "Place Bid"}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => onAddToWatchlist(auction)}
          >
            <i className="fas fa-heart me-1"></i> Watch
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
