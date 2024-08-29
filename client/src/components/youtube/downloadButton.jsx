// src/components/DownloadButton.jsx
import React from 'react';

const DownloadButton = ({ pdfUrl }) => {
  return (
    <div className="download-button">
      <a href={pdfUrl} download className="btn btn-primary">
        Download BLOG
      </a>
    </div>
  );
};

export default DownloadButton;
