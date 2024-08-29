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

    setMessage('Checking if PDF is already available...');

    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      console.log('API Base URL:', process.env.BASE_URL);
      setMessage('Invalid YouTube URL. Please enter a valid URL.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Invalid email format. Please enter a valid email.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Check if PDF is ready
      const pdfCheckResponse = await instance.get(`/get_pdf_if_ready?video_id=${videoId}`);

      if (pdfCheckResponse.data.status === 200) {
        const s3Link = pdfCheckResponse.data.data.s3_link;
        setPdfUrl(s3Link);
        setPdfReady(true);
        setMessage('PDF is ready to download.');

        // Send email with attachment
        await sendEmailWithAttachment(s3Link);

        setLoading(false);
        return;
      }

      setMessage('PDF not ready. Estimating time...');
      const estimateResponse = await instance.get(`/get_estimated_time?video_id=${videoId}`);

      if (estimateResponse.data.status !== 200) {
        setMessage('Failed to estimate time. Please try again.');
        setLoading(false);
        return;
      }

      setMessage('Starting PDF generation...');
      const generateResponse = await instance.post('/generate_pdf', { video_id: videoId, email });

      if (generateResponse.data.status !== 200) {
        setMessage('Failed to start PDF generation. Please try again.');
        setLoading(false);
        return;
      }

      setMessage('Generating PDF...');
      const interval = setInterval(async () => {
        const checkResponse = await instance.get(`/get_pdf_if_ready?video_id=${videoId}`);

        if (checkResponse.data.status === 200) {
          clearInterval(interval);
          const s3Link = checkResponse.data.data.s3_link;
          setPdfUrl(s3Link);
          setPdfReady(true);
          setMessage('PDF is ready to download.');

          // Send email with attachment
          await sendEmailWithAttachment(s3Link);

          setLoading(false);
        } else {
          setMessage(checkResponse.data.message);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error processing request:', error);
      setMessage('Error processing request. Please try again later.');
      setLoading(false);
    }
  };

  const sendEmailWithAttachment = async (s3Link) => {
    try {
      const response = await instance.post('/send_email_with_attachment', {
        email: email,
        pdfUrl: s3Link
      });

      if (response.data.status === 200) {
        setMessage('Email sent successfully with the PDF attachment.');
      } else {
        setMessage('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage('Error sending email. Please try again later.');
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
      <div className="youtube-page">
        <h1>YouTubeGPT</h1>
        <YouTubeForm
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        <StatusMessage loading={loading} pdfReady={pdfReady} />
        {pdfReady && <DownloadButton pdfUrl={pdfUrl} />}
      </div>
    </div>
  );
};

export default YouTube;
