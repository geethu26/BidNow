async function navigateToContact() {
  const mainContent = document.getElementById("main-content");

  try {
    const response = await fetch("contact.partial.html");
    const html = await response.text();
    mainContent.innerHTML = html;

    // Scroll to top
    window.scrollTo(0, 0);
  } catch (error) {
    mainContent.innerHTML =
      "<p class='text-danger'>Failed to load contact page.</p>";
  }
}

// Handle page load with #/contact
window.addEventListener("DOMContentLoaded", () => {
  if (location.hash === "#/contact") {
    navigateToContact();
  }
});

// Handle browser back/forward
window.addEventListener("hashchange", () => {
  if (location.hash === "#/contact") {
    navigateToContact();
  }
});
