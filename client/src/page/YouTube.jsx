import React, { useState } from 'react';
import instance from '../config/instance';
import YouTubeForm from '../components/youtube/youTubeForm'; // Ensure correct import path
import StatusMessage from '../components/youtube/statusMessage'; // Ensure correct import path
import DownloadButton from '../components/youtube/downloadButton'; // Ensure correct import path
import Navigation from '../components/landing/navigation'; // Ensure correct import path

const YouTube = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Processing your request...');

    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      setMessage('Invalid YouTube URL. Please enter a valid YouTube URL.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Invalid email format. Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Check if PDF is ready
      setMessage('Checking if the Blog is already available...');
      const pdfCheckResponse = await instance.get(`/get_pdf_if_ready?video_id=${videoId}`);

      if (pdfCheckResponse.data.status === 200) {
        const s3Link = pdfCheckResponse.data.data.s3_link;
        setPdfUrl(s3Link);
        setPdfReady(true);
        setMessage('Blog is ready! You can download it now.');

        // Send email with attachment
        await sendEmailWithAttachment(s3Link);
        setLoading(false);
        return;
      }

      // If PDF is not ready
      setMessage('Blog is not ready yet. Estimating preparation time...');
      const estimateResponse = await instance.get(`/get_estimated_time?video_id=${videoId}`);

      if (estimateResponse.data.status !== 200) {
        setMessage('Unable to estimate the time required for Blog generation. Please try again later.');
        setLoading(false);
        return;
      }

      setMessage('Starting Blog generation process...');
      const generateResponse = await instance.post('/generate_pdf', { video_id: videoId, email });

      if (generateResponse.data.status !== 200) {
        setMessage('Failed to initiate Blog generation. Please try again.');
        setLoading(false);
        return;
      }

      setMessage('Blog generation in progress. This might take a few moments...');
      const interval = setInterval(async () => {
        const checkResponse = await instance.get(`/get_pdf_if_ready?video_id=${videoId}`);

        if (checkResponse.data.status === 200) {
          clearInterval(interval);
          const s3Link = checkResponse.data.data.s3_link;
          setPdfUrl(s3Link);
          setPdfReady(true);
          setMessage('Blog is ready! You can download it now.');

          // Send email with attachment
          await sendEmailWithAttachment(s3Link);
          setLoading(false);
        } else {
          setMessage('Blog is still being generated. Please wait...');
        }
      }, 3000);

    } catch (error) {
      console.error('Error processing request:', error);
      setMessage('An error occurred while processing your request. Please try again later.');
      setLoading(false);
    }
  };

  const sendEmailWithAttachment = async (s3Link) => {
    try {
      console.log('S3', s3Link);
      console.log('email', email);
      const response = await instance.post('/send_email_with_attachment', {
        email: email,
        pdf_url: s3Link
      });

      if (response.data.status === 200) {
        setMessage('The email with the Blog attachment has been sent successfully.');
      } else {
        console.error('Server response error:', response.data);
        setMessage('Failed to send the email. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else {
        console.error('Error message:', error.message);
      }
      setMessage('An error occurred while sending the email. Please try again later.');
    }
  };

  const extractVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <Navigation />
      <div
        className="youtube-page"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>YouTubeGPT</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#555', margin: '10px 0' }}>
        Simplify Your Video Learning Experience
        </h2>
        <h2 style={{ fontSize: '1.2rem', color: '#777', margin: '10px 0 20px' }}>
          Quickly transform YouTube videos into SEO-friendly articles using AI technology.
        </h2>
        <YouTubeForm
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        <StatusMessage loading={loading} pdfReady={pdfReady} message={message} />
        {message && (
          <p style={{ color: '#d9534f', fontSize: '1rem', marginTop: '15px' }}>{message}</p>
        )}
        {pdfReady && <DownloadButton pdfUrl={pdfUrl} />}
      </div>
    </div>
  );
};

export default YouTube;
