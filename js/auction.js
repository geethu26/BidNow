let auctions = [];
let filteredAuctions = [];
 
let currentPage = 1;
const pageSize = 6;
 
// Format remaining time
function formatTimeRemaining(endTime) {
  const now = new Date();
  const timeDiff = endTime - now;
 
  if (timeDiff <= 0) return "ENDED";
 
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
 
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
 
// Create auction card HTML
function createAuctionCard(auction) {
  return `
  <div class="col-lg-4 col-md-6 mb-4">
    <div class="card auction-card">
      <img src="${
        auction.image
      }" class="card-img-top lazy-load" loading="lazy" alt="${
    auction.title
  }" style="height: 250px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${auction.title}</h5>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-secondary">${auction.category}</span>
          <small class="text-muted">${auction.bids} bids</small>
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
 
// Populate auction cards
function populateAuctions() {
  const container = document.getElementById("auctionContainer");
 
  const start = 0;
  const end = currentPage * pageSize;
  const auctionsToDisplay = filteredAuctions.slice(start, end);
 
  container.innerHTML = auctionsToDisplay.map(createAuctionCard).join("");
 
  // Fade-in animation
  requestAnimationFrame(() => {
    document.querySelectorAll(".auction-card").forEach((card) => {
      card.classList.add("visible");
    });
  });
 
  updateCountdowns();
}
 
// Load more using Intersection Observer
function setupLazyLoading() {
  const sentinel = document.getElementById("loadMoreSentinel");
 
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (
      entry.isIntersecting &&
      currentPage * pageSize < filteredAuctions.length
    ) {
      currentPage++;
      populateAuctions();
    }
  });
 
  observer.observe(sentinel);
}
 
// Update countdown timers
function updateCountdowns() {
  document.querySelectorAll(".countdown-timer").forEach((timer) => {
    const endTime = new Date(parseInt(timer.dataset.endTime));
    const display = timer.querySelector(".time-display");
    display.textContent = formatTimeRemaining(endTime);
  });
}
 
// Watch auction dummy action
function watchItem(auctionId) {
  alert("Added to your watch list!");
}
 
// Bid on auction
function placeBid(auctionId) {
  const auction = auctions.find((a) => a.id === auctionId);
  if (auction) {
    const minBid = auction.currentBid + 50;
    const bidAmount = prompt(`Enter your bid amount (minimum $${minBid}):`);
 
    if (bidAmount && !isNaN(bidAmount) && parseFloat(bidAmount) >= minBid) {
      const userBids = JSON.parse(sessionStorage.getItem("userBids")) || [];
 
      const newBid = {
        id: Date.now(),
        auctionId: auction.id,
        title: auction.title,
        image: auction.image,
        category: auction.category,
        bidAmount: parseFloat(bidAmount),
        previousBid: auction.currentBid,
        bidTime: new Date(),
        endTime: auction.endTime,
        status: "active",
      };
 
      userBids.push(newBid);
      auction.currentBid = parseFloat(bidAmount);
      auction.bids += 1;
 
      sessionStorage.setItem("userBids", JSON.stringify(userBids));
 
      alert(`Bid placed! You bid $${parseFloat(bidAmount).toLocaleString()}`);
      applyFilters();
    } else {
      alert(`Invalid bid. Minimum is $${minBid}`);
    }
  }
}
 
// Populate category options
function populateCategoryOptions(auctionList) {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(auctionList.map((a) => a.category))];
 
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}
 
// Apply search & category filter
function applyFilters() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;
 
  filteredAuctions = auctions.filter((item) => {
    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue);
    return matchesCategory && matchesSearch;
  });
 
  currentPage = 1;
  populateAuctions();
}
 
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
 
    auctions = data.map((item) => ({
      ...item,
      endTime: new Date(item.endTime),
    }));
 
    filteredAuctions = auctions;
 
    populateCategoryOptions(auctions);
    populateAuctions();
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
 
    document
      .getElementById("searchInput")
      .addEventListener("input", applyFilters);
    document
      .getElementById("categoryFilter")
      .addEventListener("change", applyFilters);
 
    setupLazyLoading(); // Enable Intersection Observer
  } catch (error) {
    console.error("Error fetching auctions:", error);
  }
});
 
 