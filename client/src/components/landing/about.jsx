import React from 'react';

const About = () => {
  return (
    <section id="about" className="bg-light text-center">
      <div className="container">
        <h2>About VLearn</h2>
        <p>Learn more about the mission and expertise behind the VLearn project.</p>
        <div className="row">
          <div className="col-md-6">
            <h3>Our Mission</h3>
            <p>
              The VLearn project is dedicated to transforming the way people learn from YouTube videos by leveraging advanced AI technologies. Our mission is to simplify video content comprehension and enhance learning experiences by providing structured, summarized, and easy-to-navigate content. We aim to empower users with quick, reliable insights and summaries from diverse video content.
            </p>
          </div>
          <div className="col-md-6">
            <h3>Our Team</h3>
            <p>
              The VLearn project is powered by a diverse team of AI enthusiasts, software developers, and data scientists. We are committed to harnessing the power of AI to process and summarize video content efficiently, making it more accessible for everyone. Our team strives to innovate and develop tools that improve the way video content is consumed and understood.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
