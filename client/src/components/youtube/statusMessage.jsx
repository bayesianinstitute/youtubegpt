// src/components/StatusMessage.jsx
import React from 'react';

const StatusMessage = ({ loading, pdfReady }) => {
  if (loading) {
    return <p className="status-message">Generating PDF, please wait...</p>;
  }

  if (pdfReady) {
    return <p className="status-message">Your PDF is ready! Please check your email for the download link.</p>;
  }

  return null;
};

export default StatusMessage;
