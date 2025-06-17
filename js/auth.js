document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];

  // Password toggle
  const setupPasswordToggle = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
      const toggle = document.createElement("span");
      toggle.textContent = "👁️";
      toggle.style.cursor = "pointer";
      toggle.style.position = "absolute";
      toggle.style.right = "10px";
      toggle.style.top = "10px";

      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";

      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      wrapper.appendChild(toggle);

      toggle.addEventListener("click", () => {
        input.type = input.type === "password" ? "text" : "password";
        toggle.textContent = input.type === "password" ? "👁️" : "x";
      });
    }
  };

  setupPasswordToggle("signupPassword");
  setupPasswordToggle("loginPassword");

  //Signup Form
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();
      const role = document.getElementById("signupRole").value;

      //Password validation
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
      if (!passwordRegex.test(password)) {
        alert(
          "Password must be at least 6 characters long and include:\n- 1 uppercase letter\n- 1 lowercase letter\n- 1 number\n- 1 special character"
        );
        return;
      }

      const users = getUsers();
      if (users.find((u) => u.email === email)) {
        alert("Email already registered");
        return;
      }

      users.push({ name, email, password, role });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! Please log in.");
      window.location.href = "login.html";
    });
  }

  //Login Form
  // Login Form
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
 
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const role = document.getElementById("loginRole").value;
    const passwordWarning = document.getElementById("passwordWarning");
 
    const users = getUsers();
    const user = users.find((u) => u.email === email);
 
    if (user && user.password === password) {
      if (user.role !== role) {
        alert("Selected role does not match user role.");
        return;
      }
 
      // Clear warning if previously shown
      passwordWarning.style.display = "none";
 
      localStorage.setItem("loggedInUser", user.name);
      localStorage.setItem("userRole", user.role);
 
      if (user.role === "Admin") {
        window.location.href = "admin-homepage.html";
      } else {
        window.location.href = "user-homepage.html";
      }
    } else {
      // Show password warning below the field
      passwordWarning.style.display = "block";
    }
  });
}
});
