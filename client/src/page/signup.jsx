import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast'; // Import toast and Toaster
import Navigation from '../components/landing/navigation'; // Import Navigation
import Footer from '../components/landing/footer'; // Import Footer
import '../css/signup.css'; // Add specific CSS if needed for styling

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, password, confirmPassword, phone } = formData;

    // Form validation
    if (!firstname || !lastname || !email || !password || !confirmPassword || !phone) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // API call for signup
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Signup successful! Redirecting to login...');
        setLoading(false);

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = '/signin'; // Redirect to login page
        }, 2000);
      } else {
        toast.error(data.message || 'Signup failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      toast.error('Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation Component */}
      <Navigation />
      
      <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-header">YouTube GPT</h2>
          <p>Sign up for your YouTube GPT account</p>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>

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
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
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

            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="extra-links">
            <p>
              Already have an account? <a href="/signin">Sign in</a>
            </p>
          </div>
        </div>

        {/* Toaster for displaying notifications */}
        <Toaster position="top-right" reverseOrder={false} />
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Signup;
