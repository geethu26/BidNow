const auctions = [
  {
    id: 1,
    title: "Vintage Rolex Submariner",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
    currentBid: 12500,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    category: "Jewelry",
    bids: 23,
  },
  {
    id: 2,
    title: "MacBook Pro 16-inch M3",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    currentBid: 2100,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    category: "Electronics",
    bids: 15,
  },
  {
    id: 3,
    title: "BMW M3 Competition",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    currentBid: 48000,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    category: "Vehicles",
    bids: 31,
  },
  {
    id: 4,
    title: "Antique Persian Rug",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    currentBid: 3200,
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    category: "Antiques",
    bids: 8,
  },
  {
    id: 5,
    title: "Original Oil Painting",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    currentBid: 1800,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    category: "Art",
    bids: 12,
  },
  {
    id: 6,
    title: "Diamond Tennis Bracelet",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    currentBid: 5600,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    category: "Jewelry",
    bids: 27,
  },
  {
    id: 7,
    title: "Flagship Android Smartphone",
    image:
      "https://images.unsplash.com/photo-1721059537602-e844ccc60c94?w=500&auto=format&fit=crop",
    currentBid: 950,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    category: "Electronics",
    bids: 20,
  },
  {
    id: 8,
    title: "Elegant Pearl Necklace",
    image:
      "https://plus.unsplash.com/premium_photo-1674255466849-b23fc5f5d3eb?w=500&auto=format&fit=crop",
    currentBid: 1200,
    endTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
    category: "Jewelry",
    bids: 14,
  },
  {
    id: 9,
    title: "Abstract Oil Painting",
    image:
      "https://plus.unsplash.com/premium_photo-1664013263421-91e3a8101259?w=500&auto=format&fit=crop",
    currentBid: 2500,
    endTime: new Date(Date.now() + 14 * 60 * 60 * 1000), // 14 hours from now
    category: "Art",
    bids: 20,
  },
  {
    id: 10,
    title: "Gold Diamond Studded Ring",
    image:
      "https://images.unsplash.com/photo-1647581301471-9eadeab8f4e8?w=500&auto=format&fit=crop",
    currentBid: 750,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    category: "Jewelry",
    bids: 22,
  },
  {
    id: 11,
    title: "Red Sports Coupe",
    image:
      "https://images.unsplash.com/photo-1728885717653-638408f30667?w=500&auto=format&fit=crop",
    currentBid: 35000,
    endTime: new Date(Date.now() + 10 * 60 * 60 * 1000), // 10 hours from now
    category: "Vehicles",
    bids: 24,
  },
];

// Function to format time remaining
function formatTimeRemaining(endTime) {
  const now = new Date();
  const timeDiff = endTime - now;

  if (timeDiff <= 0) {
    return "ENDED";
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Function to create auction card HTML
function createAuctionCard(auction) {
  return `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card auction-card">
                        <img src="${auction.image}" class="card-img-top" alt="${
    auction.title
  }" style="height: 250px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${auction.title}</h5>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-secondary">${
                                  auction.category
                                }</span>
                                <small class="text-muted">${
                                  auction.bids
                                } bids</small>
                            </div>
                            <div class="bid-amount">$${auction.currentBid.toLocaleString()}</div>
                            <div class="countdown-timer" data-end-time="${auction.endTime.getTime()}">
                                <i class="fas fa-clock me-1"></i>
                                <span class="time-display">${formatTimeRemaining(
                                  auction.endTime
                                )}</span>
                            </div>
                            <div class="d-grid gap-2 mt-3">
                                <button class="btn btn-primary btn-custom" onclick="placeBid(${
                                  auction.id
                                })">
                                    <i class="fas fa-gavel me-1"></i> Place Bid
                                </button>
                                <button class="btn btn-outline-secondary" onclick="watchItem(${
                                  auction.id
                                })">
                                    <i class="fas fa-heart me-1"></i> Watch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
}

// Function to populate auctions
function populateAuctions() {
  const container = document.getElementById("auctionContainer");
  container.innerHTML = auctions.map(createAuctionCard).join("");
}

// Watch item function
function watchItem(auctionId) {
  alert(
    `Added to your watch list! You'll be notified of any updates for this auction.`
  );
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  populateAuctions();

  // Update countdowns every second
  setInterval(updateCountdowns, 1000);

  // Initial countdown update
  updateCountdowns();
});

//view all auction
document
  .querySelector(".btn.btn-primary.btn-custom")
  .addEventListener("click", (e) => {
    e.preventDefault();
    const aud = document.getElementById("auctions");
    if (aud) aud.scrollIntoView({ behavior: "smooth" });
  });
