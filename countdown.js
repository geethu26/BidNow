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
