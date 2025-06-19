interface Auction {
  id: number;
  title: string;
  category: string;
  image: string;
  currentBid: number;
  bids: number;
  endTime: Date;
}

interface UserBid {
  id: number;
  auctionId: number;
  title: string;
  image: string;
  category: string;
  bidAmount: number;
  previousBid: number;
  bidTime: Date;
  endTime: Date;
  status: string;
}

let auctions: Auction[] = [];
let filteredAuctions: Auction[] = [];

let currentPage = 1;
const pageSize = 6;

function formatTimeRemaining(endTime: Date): string {
  const now = new Date();
  const timeDiff = endTime.getTime() - now.getTime();
  if (timeDiff <= 0) return "ENDED";

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  // Ensure each is a string before calling padStart
  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

function createAuctionCard(auction: Auction): string {
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
  </div>`;
}

function populateAuctions(): void {
  const container = document.getElementById("auctionContainer") as HTMLElement;
  const start = 0;
  const end = currentPage * pageSize;
  const auctionsToDisplay = filteredAuctions.slice(start, end);
  container.innerHTML = auctionsToDisplay.map(createAuctionCard).join("");

  requestAnimationFrame(() => {
    document.querySelectorAll(".auction-card").forEach((card) => {
      card.classList.add("visible");
    });
  });

  updateCountdowns();
}

function setupLazyLoading(): void {
  const sentinel = document.getElementById("loadMoreSentinel");
  if (!sentinel) return;

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

function updateCountdowns(): void {
  document
    .querySelectorAll<HTMLElement>(".countdown-timer")
    .forEach((timer) => {
      const endTime = new Date(parseInt(timer.dataset.endTime || "0"));
      const display = timer.querySelector(".time-display");
      if (display) display.textContent = formatTimeRemaining(endTime);
    });
}

function watchItem(auctionId: number): void {
  alert("Added to your watch list!");
}

function placeBid(auctionId: number): void {
  const auction = auctions.find((a) => a.id === auctionId);
  if (!auction) return;

  const minBid = auction.currentBid + 50;
  const bidAmountInput = prompt(`Enter your bid amount (minimum $${minBid}):`);
  const bidAmount = parseFloat(bidAmountInput || "");

  if (!isNaN(bidAmount) && bidAmount >= minBid) {
    const stored = sessionStorage.getItem("userBids");
    const userBids: UserBid[] = stored ? JSON.parse(stored) : [];

    const newBid: UserBid = {
      id: Date.now(),
      auctionId: auction.id,
      title: auction.title,
      image: auction.image,
      category: auction.category,
      bidAmount,
      previousBid: auction.currentBid,
      bidTime: new Date(),
      endTime: auction.endTime,
      status: "active",
    };

    userBids.push(newBid);
    auction.currentBid = bidAmount;
    auction.bids += 1;
    sessionStorage.setItem("userBids", JSON.stringify(userBids));
    alert(`Bid placed! You bid $${bidAmount.toLocaleString()}`);
    applyFilters();
  } else {
    alert(`Invalid bid. Minimum is $${minBid}`);
  }
}

function populateCategoryOptions(auctionList: Auction[]): void {
  const select = document.getElementById("categoryFilter") as HTMLSelectElement;
  const categories = [...new Set(auctionList.map((a) => a.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function applyFilters(): void {
  const searchValue = (
    document.getElementById("searchInput") as HTMLInputElement
  ).value.toLowerCase();
  const selectedCategory = (
    document.getElementById("categoryFilter") as HTMLSelectElement
  ).value;

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
    const data: any[] = await response.json();
    auctions = data.map((item) => ({
      ...item,
      endTime: new Date(item.endTime),
    })) as Auction[];
    filteredAuctions = auctions;
    populateCategoryOptions(auctions);
    populateAuctions();
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    (
      document.getElementById("searchInput") as HTMLInputElement
    )?.addEventListener("input", applyFilters);
    (
      document.getElementById("categoryFilter") as HTMLSelectElement
    )?.addEventListener("change", applyFilters);
    setupLazyLoading();
  } catch (error) {
    console.error("Error fetching auctions:", error);
  }
});
