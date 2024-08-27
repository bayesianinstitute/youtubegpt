// src/components/StatusMessage.jsx
import React from 'react';

const StatusMessage = ({ loading, pdfReady }) => {
  if (loading) {
    return <p className="status-message">Generating PDF, please wait...</p>;
  }

  if (pdfReady) {
    return <p className="status-message">Your PDF is ready!</p>;
  }

  return null;
};

export default StatusMessage;
