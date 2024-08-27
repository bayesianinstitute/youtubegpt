// src/components/YouTubeForm.jsx
import React from 'react';

const YouTubeForm = ({ videoUrl, setVideoUrl, handleSubmit, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="youtube-form">
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        required
        className="form-input"
      />
      <button type="submit" disabled={loading} className="form-button">
        {loading ? 'Generating...' : 'Generate PDF'}
      </button>
    </form>
  );
};

export default YouTubeForm;
