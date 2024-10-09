import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h2>About VLearn</h2>
            <p>
             VLearn simplifies video learning by providing concise summaries, chapter segmentation, and visual highlights from YouTube videos. Our platform utilizes cutting-edge AI technology to transform complex video content into accessible and easy-to-digest information, enhancing your learning experience.
            </p>
          </div>

          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/testimonials">Testimonials</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/vlearn">VLearn</a></li>
            </ul>
          </div>

          {/* Uncomment and update the social links section if needed */}
          {/* <div className="footer-section social">
            <h2>Follow Us</h2>
            <div className="social-links">
              <a href="#a"><i className="fa fa-facebook"></i></a>
              <a href="#a"><i className="fa fa-twitter"></i></a>
              <a href="#a"><i className="fa fa-instagram"></i></a>
              <a href="#a"><i className="fa fa-linkedin"></i></a>
            </div>
          </div> */}
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()}VLearn | All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
