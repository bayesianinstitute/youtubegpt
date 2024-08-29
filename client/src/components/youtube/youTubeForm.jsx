// src/components/youtube/YouTubeForm.jsx
import React from 'react';

const YouTubeForm = ({ videoUrl, setVideoUrl, email, setEmail, handleSubmit, loading }) => {
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
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} // Correctly use setEmail here
        required
        className="form-input"
      />
      <button type="submit" disabled={loading || !videoUrl || !email} className="form-button">
        {loading ? 'Generating...' : 'Generate Blog'}
      </button>
    </form>
  );
};

export default YouTubeForm;
