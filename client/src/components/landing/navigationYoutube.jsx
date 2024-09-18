import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import toast from 'react-hot-toast'; // Use for notifications

const Navigation = () => {
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Add state to track logout

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/user/logout', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Clear the token before navigating
        localStorage.removeItem('token');

        // Show success notification
        toast.success(data.message || 'Logged out successfully!');

        // Set state to trigger a re-render
        setIsLoggedOut(true);
      } else {
        toast.error(data.message || 'Logout failed.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed. Please try again.');
    }
  };

  // Redirect after logout
  if (isLoggedOut) {
    navigate('/signin');
    window.location.href = '/signin'; 
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <Link className="navbar-brand" to="/home">
        <img src="youtube-gpt-logo.png" alt="YouTubeGPT Logo" className="logo" />
      </Link>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/features">Features</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/testimonials">Testimonials</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/contact">Contact</a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/youtube">Try Beta</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" onClick={handleLogout}> Logout</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
