import React from 'react';

const Testimonials = () => {
  const testimonialsData = [
    {
      quote: "YouTubeGPT has significantly improved my learning efficiency. The video summaries save me so much time!",
      name: "Alice Johnson",
      position: "Content Creator",
    },
    {
      quote: "As a researcher, YouTubeGPT's chapter segmentation feature is invaluable. It helps me find the exact content I need quickly.",
      name: "Michael Lee",
      position: "Research Analyst",
    },
    {
      quote: "I love using YouTubeGPT to get the key points from lengthy videos. It's like having a personal video assistant.",
      name: "Emily Davis",
      position: "Student",
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-container">
          {testimonialsData.map((testimonial, index) => (
            <div className="testimonial" key={index}>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <h4 className="testimonial-name">{testimonial.name}</h4>
              <p className="testimonial-position">{testimonial.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
