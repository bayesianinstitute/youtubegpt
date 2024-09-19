import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navigation from '../components/landing/navigation'; // Import Navigation
import Footer from '../components/landing/footer'; // Import Footer
import '../css/signin.css';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Simple form validation
    if (!email || !password) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);

    try {
      // API call for sign-in
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // Check if the response contains the user data
      if (data.success && data && data.data.user) {
        toast.success(`Welcome Redirecting...`); // Fixed template literal
        setLoading(false);
      
        // Set token in localStorage or cookies if needed
        localStorage.setItem('token', data.data.token);
        // localStorage.setItem('email', data.data.user.email);
        // Redirect to /youtube after successful login using navigate
        setTimeout(() => {
          navigate('/youtube'); // Use navigate for client-side routing
          window.location.href = '/youtube'; 
        }, 2000);
      } else {
        // If user data is missing, handle it gracefully
        const errorMessage = data?.message || 'Sign in failed. Please try again.';
        toast.error(errorMessage);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      toast.error('Sign in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation Component */}
      <Navigation />

      <div className="signin-container">
        <div className="signin-box">
          <h2 className="signin-header">YouTube GPT</h2>
          <p>Sign in to your YouTube GPT account</p>

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="extra-links">
            <p>
              <a href="/forgotpassword">Forgot password?</a>
            </p>
            <p>
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>

          {/* Toast container to show notifications */}
          <ToastContainer />
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Signin;
