import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (pw) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{6,}$/.test(pw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = form;

    if (!validatePassword(password)) {
      return alert(
        "Password must be at least 6 characters long and include:\n- 1 uppercase letter\n- 1 lowercase letter\n- 1 number\n- 1 special character"
      );
    }

    try {
      const res = await fetch(`http://localhost:5000/users?email=${email}`);
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        return alert("Email already registered");
      }

      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      alert("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong while signing up.");
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
            <h2 className="text-center mb-4">Signup for BidNow</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <span
                  style={toggleStyle}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <button className="btn btn-primary w-100">Sign Up</button>
              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
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

export default SignupPage;
