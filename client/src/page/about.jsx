import React from 'react';
import Navigation from '../components/landing/navigation';
import Footer from '../components/landing/footer';
import About from '../components/landing/about';
import '../App.css';

const AboutPage = () => {
  return (
    <div>
      <Navigation />
      <About />
      <Footer />
    </div>
  );
};

export default AboutPage;
