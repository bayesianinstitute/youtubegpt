import React from 'react';
import Navigation from '../components/landing/navigation';
import Footer from '../components/landing/footer';
import CardsSection from '../components/landing/cardsSection';
import '../App.css';

const FeaturesPage = () => {
  return (
    <div>
      <Navigation />
      <CardsSection />
      <Footer />
    </div>
  );
};

export default FeaturesPage;
