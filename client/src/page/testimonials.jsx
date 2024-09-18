import React from 'react';
import Navigation from '../components/landing/navigation';
import Footer from '../components/landing/footer';
import Testimonials from '../components/landing/testimonials';
import '../App.css';

const Testimonial = () => {
  return (
    <div>
      <Navigation />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Testimonial;
