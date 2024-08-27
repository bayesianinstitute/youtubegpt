import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <Link className="navbar-brand" to="/home"> {/* Use Link for internal navigation */}
        <img src="youtube-gpt-logo.png" alt="YouTubeGPT Logo" className="logo" /> {/* Update logo to YouTubeGPT */}
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#about">About</a> {/* Keeps the page anchor for About */}
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#feature">Features</a> {/* Keeps the page anchor for Features */}
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#testimonials">Testimonials</a> {/* Keeps the page anchor for Testimonials */}
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#contact">Contact</a> {/* Keeps the page anchor for Contact */}
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/youtube">YoutubeGPT</Link> {/* Use Link for internal navigation */}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
