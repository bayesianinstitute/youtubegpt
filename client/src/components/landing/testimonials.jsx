import React from 'react';

const Testimonials = () => {
  const testimonialsData = [
    {
      quote: "YouTubeGPT has revolutionized how I create content. Turning my YouTube videos into detailed blog posts is now faster and more efficient than ever!",
      name: "John Doe",
      position: "YouTuber & Blogger",
    },
    {
      quote: "The technology behind YouTubeGPT has saved me countless hours. I can quickly extract key information from videos without watching the entire thing.",
      name: "Sarah Williams",
      position: "Tech Enthusiast",
    },
    {
      quote: "Thanks to YouTubeGPT's multilingual support, I can now understand and summarize videos in multiple languages, which has expanded my learning resources globally.",
      name: "Carlos Martínez",
      position: "Language Learner",
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
