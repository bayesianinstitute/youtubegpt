import React, { useState } from 'react';
import instance from '../config/instance';
import YouTubeForm from '../components/youtube/youTubeForm';
import StatusMessage from '../components/youtube/statusMessage';
import DownloadButton from '../components/youtube/downloadButton';
import Navigation from '../components/landing/navigation';

const YouTube = () => {
  const [videoUrl, setVideoUrl] = useState('');
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

    try {
      // Step 1: Check if PDF is ready
      const pdfCheckResponse = await instance.get(`/get_pdf_if_ready?video_id=${videoId}`);
      

      if (pdfCheckResponse.data.status === 200) {
        // PDF is ready, fetch the download URL
        fetchPdfUrl(videoId);
        return;
      }

      // Step 2: PDF is not ready, get estimated time
      setMessage('PDF not ready. Estimating time...');
      const estimateResponse = await instance.get(`/get_estimated_time?video_id=${videoId}`);

      if (estimateResponse.data.status !== 200) {
        setMessage('Failed to estimate time. Please try again.');
        setLoading(false);
        return;
      }

      // Step 3: Start generating the PDF
      setMessage('Starting PDF generation...');
      const generateResponse = await instance.post('/generate_pdf', { video_id: videoId });

      if (generateResponse.data.status !== 200) {
        setMessage('Failed to start PDF generation. Please try again.');
        setLoading(false);
        return;
      }

      // Step 4: Polling to check if the PDF is ready
      setMessage('Generating PDF...');
      const interval = setInterval(async () => {
        const checkResponse = await instance.get(`/get_pdf_if_ready?video_id=${videoId}`);

        if (checkResponse.data.status === 200) {
          // PDF is ready, fetch the download URL
          clearInterval(interval);
          fetchPdfUrl(videoId);
        } else {
          setMessage(checkResponse.data.message);  // "PDF is still being generated."
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error processing request:', error);
      setMessage('Error processing request. Please try again later.');
      setLoading(false);
    }
  };

  const fetchPdfUrl = async (videoId) => {
    try {
      // Fetch the download URL from the server
      const downloadResponse = await instance.get(`/download_pdf?video_id=${videoId}`, { responseType: 'blob' });

      if (downloadResponse.status === 200) {
        // Create a URL from the response blob
        const url = window.URL.createObjectURL(new Blob([downloadResponse.data], { type: 'application/pdf' }));
        setPdfUrl(url);
        setPdfReady(true);
        setMessage('PDF is ready to download.');
      } else {
        setMessage('Failed to fetch PDF. Please try again.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      setMessage('Error fetching PDF. Please try again later.');
      setLoading(false);
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

  return (
    <div>
      <Navigation />
      <div className="youtube-page">
        <h1>YouTubeGPT</h1>
        <YouTubeForm videoUrl={videoUrl} setVideoUrl={setVideoUrl} handleSubmit={handleSubmit} loading={loading} />
        <StatusMessage loading={loading} message={message} />
        {pdfReady && <DownloadButton pdfUrl={pdfUrl} />}
      </div>
    </div>
  );
};

export default YouTube;
