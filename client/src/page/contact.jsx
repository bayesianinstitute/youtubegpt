import React from 'react';
import Navigation from '../components/landing/navigation';
import Footer from '../components/landing/footer';
import Contact from '../components/landing/contact';
import '../App.css';

const ContactPage = () => {
  return (
    <div>
      <Navigation />
      <Contact />
      <Footer />
    </div>
  );
};

export default ContactPage;
