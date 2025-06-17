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

function updateCountdowns() {
  const countdownElements = document.querySelectorAll(".countdown-timer");
  countdownElements.forEach((element) => {
    const endTime = new Date(parseInt(element.dataset.endTime));
    const timeDisplay = element.querySelector(".time-display");
    const remaining = formatTimeRemaining(endTime);

    if (remaining === "ENDED") {
      element.classList.remove("bg-danger");
      element.classList.add("bg-secondary");
      timeDisplay.textContent = "ENDED";
    } else {
      timeDisplay.textContent = remaining;
    }
  });
}

// Bid placement function
function placeBid(auctionId) {
  const auction = auctions.find((a) => a.id === auctionId);
  if (auction) {
    const minBid = auction.currentBid + 50; // Minimum increment of $50
    const bidAmount = prompt(
      `Enter your bid amount (minimum $${minBid.toLocaleString()}):`
    );

    if (bidAmount && !isNaN(bidAmount) && parseFloat(bidAmount) >= minBid) {
      auction.currentBid = parseFloat(bidAmount);
      auction.bids += 1;
      populateAuctions();
      alert(
        `Bid placed successfully! Your bid: $${parseFloat(
          bidAmount
        ).toLocaleString()}`
      );
    } else if (bidAmount) {
      alert(`Invalid bid amount. Minimum bid is $${minBid.toLocaleString()}`);
    }
  }
}
