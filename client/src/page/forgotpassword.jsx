import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast'; // Import toast and Toaster
import Navigation from '../components/landing/navigation'; // Import Navigation
import Footer from '../components/landing/footer'; // Import Footer
import '../css/forgotpassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Failed to send password reset link. Please try again.');
      }
    } catch (err) {
      toast.error('Failed to send password reset link. Please try again.');
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
          <h2 className="forgot-password-header">YouTube GPT</h2>
          <p>Reset your YouTube GPT account password</p>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <button type="submit" className="forgot-password-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
