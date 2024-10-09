import React from 'react';

const Features = () => {
  return (
    <section id="feature" className="text-center">
      <div className="container">
        <h2>Features</h2>
        <p>Discover the powerful features that make VLearn the ultimate tool for video learning and summarization.</p>
        <div className="row">
          <div className="col-md-4">
            <i className="fa fa-file-alt"></i>
            <h3>Automated Video Summaries</h3>
            <p>Quickly generate concise summaries of YouTube videos, allowing for efficient comprehension of key content.</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-list-alt"></i>
            <h3>Chapter Segmentation</h3>
            <p>Automatically divide videos into meaningful chapters, enhancing navigation and learning efficiency.</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-image"></i>
            <h3>Visual Highlights</h3>
            <p>Extract key screenshots and visual highlights from videos to complement textual summaries and enhance understanding.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
