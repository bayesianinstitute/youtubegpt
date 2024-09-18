import React from 'react'; // Removed useState since it's no longer needed
import { Link } from 'react-router-dom'; // Removed useNavigate

const Navigation = () => {
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
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
