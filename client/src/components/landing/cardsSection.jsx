import React from 'react';
import Card from './card.jsx';

const CardsSection = () => {
  const cardData = [
    {
      title: 'Automatic Video Summarization',
      description: 'Generate concise and structured summaries of YouTube videos using advanced AI, making it easier to grasp key points and main ideas quickly.',
    },
    {
      title: 'Chapter Segmentation',
      description: 'Automatically divide videos into meaningful chapters and segments to enhance navigation and improve content accessibility.',
    },
    {
      title: 'Visual Content Extraction',
      description: 'Capture important screenshots and visual elements from videos to provide a more engaging and informative summary experience.',
    },
  ];

  return (
    <section id="cards" className="text-center">
      <div className="container">
        <h2>Our Features</h2>
        <div className="cards-container">
          {cardData.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardsSection;
