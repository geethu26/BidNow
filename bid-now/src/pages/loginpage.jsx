import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/users?email=${encodeURIComponent(email)}`
      );
      const users = await res.json();
      const user = users[0];

      if (!user) {
        setError("No user found with this email.");
        return;
      }

      if (user.password !== password) {
        setError("Incorrect password. Please try again.");
        return;
      }

      if (user.role !== role) {
        setError("Selected role does not match user role.");
        return;
      }

      // Save session
      localStorage.setItem("loggedInUser", user.name);
      localStorage.setItem("loggedInUserEmail", user.email);
      localStorage.setItem("userRole", user.role);
      setError("");

      // Redirect
      navigate(user.role === "Admin" ? "/admin" : "/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Error connecting to server. Please try again.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md-6 left-pane d-none d-md-block"
          style={leftPaneStyle}
        ></div>
        <div className="col-md-6 right-pane" style={rightPaneStyle}>
          <div className="w-75">
            <h2 className="text-center mb-4">Login to BidNow</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  style={toggleStyle}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
                {error && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {error}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <button className="btn btn-success w-100">Login</button>
              <p className="text-center mt-3">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const leftPaneStyle = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  height: "100vh",
};

const rightPaneStyle = {
  backgroundColor: "#f8f9fa",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const toggleStyle = {
  position: "absolute",
  right: "10px",
  top: "38px",
  cursor: "pointer",
  userSelect: "none",
};

export default LoginPage;
