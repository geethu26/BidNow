import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track if user has interacted with each field
  const [successMessage, setSuccessMessage] = useState(""); // <-- New success message state

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validatePassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{6,}$/.test(pw);

  const validateForm = (updatedForm) => {
    const { name, email, password, confirmPassword, role } = updatedForm;
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password))
      newErrors.password =
        "Must have 6+ chars, uppercase, lowercase, number, symbol";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!role) newErrors.role = "Please select a role";

    return newErrors;
  };

  useEffect(() => {
    setErrors(validateForm(form));
  }, [form]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true, // fixed typo here: was userEmail
      password: true,
      confirmPassword: true,
      role: true,
    });

    const currentErrors = validateForm(form);
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) return;

    try {
      const res = await fetch(
        `http://localhost:5000/users?email=${form.email}`
      );
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        setErrors({ email: "Email already registered" });
        return;
      }

      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      setSuccessMessage("Signup successful! Redirecting to login...");
      // Wait 5 seconds before redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ global: "Signup failed. Try again later." });
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

            {/* Success message */}
            {successMessage && (
              <div className="alert alert-success text-center">
                {successMessage}
              </div>
            )}

            {errors.global && (
              <div className="alert alert-danger">{errors.global}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    touched.name && errors.name ? "is-invalid" : ""
                  }`}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  disabled={!!successMessage} // disable input when success msg showing
                />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${
                    touched.email && errors.email ? "is-invalid" : ""
                  }`}
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  disabled={!!successMessage}
                />
                {touched.email && errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    touched.password && errors.password ? "is-invalid" : ""
                  }`}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  disabled={!!successMessage}
                />
                <span
                  style={toggleStyle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
                {touched.password && errors.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "is-invalid"
                      : ""
                  }`}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  disabled={!!successMessage}
                />
                <span
                  style={{ ...toggleStyle, top: "38px" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="invalid-feedback d-block">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className={`form-select ${
                    touched.role && errors.role ? "is-invalid" : ""
                  }`}
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  onBlur={() => handleBlur("role")}
                  disabled={!!successMessage}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
                {touched.role && errors.role && (
                  <div className="invalid-feedback">{errors.role}</div>
                )}
              </div>

              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={!!successMessage}
              >
                Sign Up
              </button>
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
