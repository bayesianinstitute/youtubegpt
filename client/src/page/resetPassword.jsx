import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get token from URL
import toast, { Toaster } from "react-hot-toast"; // for notifications
import Navigation from '../components/landing/navigation'; // Import Navigation
import Footer from '../components/landing/footer'; // Import Footer
import '../css/forgotpassword.css'; // CSS for styling

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get the token from URL parameters using useParams
  const { token } = useParams(); // Extract the token from the URL
  
  // Handle password input changes
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // Function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      // This block runs if passwords do not match, showing an error message
      toast.error("Passwords do not match");
      return; // Stop the form submission if the passwords do not match
    }

    // Ensure token is present in the URL
    if (!token) {
      toast.error("Token not found in URL. Please check the link and try again.");
      return;
    }

    // Call the API
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/forgot-finish`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verifyToken: token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset successful!");
        navigate("/signin"); // Redirect to login page after success
      } else {
        toast.error(data.message || "Password reset failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation Component */}
      <Navigation />

      <div className="forgot-password-container">
        <div className="forgot-password-box">
          <h2 className="forgot-password-header">Reset Your Password</h2>
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>

            <button
              type="submit"
              className="forgot-password-button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="extra-links">
            <p>
              <a href="/signin">Back to Sign In</a>
            </p>
          </div>
        </div>
      </div>

      {/* Toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default ResetPassword;
