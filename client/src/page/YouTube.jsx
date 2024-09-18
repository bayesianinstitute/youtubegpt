import React, { useState, useEffect } from 'react'; // Import useEffect
import instance from '../config/instance'; // Axios instance for API requests
import StatusMessage from '../components/youtube/statusMessage'; // Ensure correct import path
import DownloadButton from '../components/youtube/downloadButton'; // Ensure correct import path
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import Navigation from '../components/landing/navigationYoutube'; // Ensure correct import path
import Footer from '../components/landing/footer'; // Import Footer component

const YouTube = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null); // Handle file upload
  const [estimatedTime, setEstimatedTime] = useState(null); // Estimated time for transcription
  const [videoSummaries, setVideoSummaries] = useState([]); // Store popular video summaries
  const [isUploading, setIsUploading] = useState(false); // Toggle between YouTube URL and upload

  let cleanUrl;

  // Toggle between URL input and video upload input
  const handleToggle = () => {
    setIsUploading(!isUploading);
    setUploadedFile(null);
    setVideoUrl('');
    setEstimatedTime(null);
    setVideoSummaries([]); // Clear video summaries when switching modes
  };

  // Utility function to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    try {
      const videoIdMatch = url.match(/(?:\?v=|\/embed\/|\/v\/|\/\d\/|\/vi\/|\/v=|\/e\/|watch\?v=|\/videos\/|\/\?v=|\/embed\?v=|youtu.be\/|\/v\/|\/v\/|\/embed\/|youtu.be\/|\/v\/|\/\w{11}\/|youtu.be\/|watch\?v=)([^#&?]*)([^#&?]*)/);
      return (videoIdMatch && videoIdMatch[1].length === 11) ? videoIdMatch[1] : null;
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  };

  const extractUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtube.com") {
        const videoId = parsedUrl.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        } else {
          throw new Error("No video ID found in URL.");
        }
      } else {
        throw new Error("Not a valid YouTube URL.");
      }
    } catch (error) {
      console.error("Error extracting URL:", error);
      return null;
    }
  };

  const fetchPopularVideos = async (keywords) => {
    try {
      const response = await instance.get(`/youtube/search?query=${keywords}`);
      if (response.status === 200) {
        setVideoSummaries(response.data);
      } else {
        console.error('Failed to fetch popular videos:', response.data);
      }
    } catch (error) {
      console.error('Error fetching popular videos:', error);
    }
  };

  const fetchKeywords = async (videoId) => {
    try {
      const response = await instance.get(`/youtube/tags?video_id=${videoId}`);
      if (response.status === 200) {
        return response.data.keywords;
      } else {
        console.error('Failed to fetch keywords:', response.data);
        setMessage('Failed to fetch keywords for the video.');
        return '';
      }
    } catch (error) {
      console.error('Error fetching keywords:', error);
      setMessage('An error occurred while fetching keywords.');
      return '';
    }
  };
  // Automatically fetch popular videos related to 'surfing' when the component mounts
    useEffect(() => {
      console.log('Fetching popular videos...');
      fetchPopularVideos('browse');
    }, []); // Empty dependency array to run only on mount
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Processing your request...');

    let videoId;
    let isUploaded = false; // Default flag for YouTube URLs

    // Display a toast message to notify the user that the process has started
    toast.info("Processing your request...");

    if (isUploading) {
      isUploaded = true; // Set the flag to true for uploaded videos
      if (!uploadedFile) {
        setMessage('Please upload a video file.');
        setLoading(false);
        toast.error("Please upload a video file.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        const uploadResponse = await instance.post('/upload_and_transcribe', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        videoId = uploadResponse.data.video_id;
        if (!videoId) {
          setMessage('Failed to upload the video. Please try again.');
          setLoading(false);
          toast.error("Failed to upload the video.");
          return;
        }

        setMessage('Fetching estimated transcription time...');
        toast.info('Fetching estimated transcription time...');
        const timeResponse = await instance.post('/get_estimated_time_with_transcript', {
          video_id: videoId,
          user_upload_video: true
        });

        if (timeResponse.data.status === 200) {
          setEstimatedTime(timeResponse.data.data.estimated_time); // Set estimated time
          setMessage(`Estimated time: ${timeResponse.data.data.estimated_time} seconds. Generating blog...`);
          toast.success('Transcription complete. Generating blog...');
          await generateBlog(videoId, isUploaded);
        } else {
          setMessage('Failed to estimate transcription time.');
          setLoading(false);
          toast.error('Failed to estimate transcription time.');
        }
      } catch (error) {
        console.error('Error processing request:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
        toast.error('An error occurred while processing your request.');
        setLoading(false);
      }

    } else {
      // Case 2: Handling YouTube URL submission
      videoId = extractVideoId(videoUrl);

      if (!videoId) {
        setMessage('Invalid YouTube URL. Please enter a valid YouTube URL.');
        setLoading(false);
        toast.error('Invalid YouTube URL. Please enter a valid URL.');
        return;
      }

      if (!validateEmail(email)) {
        setMessage('Invalid email format. Please enter a valid email address.');
        setLoading(false);
        toast.error('Invalid email format.');
        return;
      }

      try {
        setMessage('Checking if captions are available...');
        toast.info('Checking if captions are available...');
        const transcriptResponse = await instance.get(`/get_estimated_time?video_id=${videoId}`);

        if (transcriptResponse.data.status === 200) {
          setMessage('Captions found, generating the blog...');
          toast.success('Captions found. Generating the blog...');
          const keywords = await fetchKeywords(videoId);
          if (keywords) await fetchPopularVideos(keywords);
          await generateBlog(videoId, isUploaded);
        } else {
          cleanUrl = extractUrl(videoUrl);
          setMessage('No captions available, uploading and transcribing video with Whisper...');
          toast.info('No captions available. Transcribing video with Whisper...');
          const uploadResponse = await instance.post('/transcribe', { url: cleanUrl });

          if (uploadResponse.data.status === 200) {
            videoId = uploadResponse.data.video_id;
            setMessage('Transcription completed, fetching estimated transcription time...');
            toast.success('Transcription completed.');
            const transcribeResponse = await instance.post('/get_estimated_time_with_transcript', {
              video_id: videoId,
              user_upload_video: false
            });

            if (transcribeResponse.data.status === 200) {
              setEstimatedTime(transcribeResponse.data.estimated_time);
              setMessage(`Estimated time: ${transcribeResponse.data.data.estimated_time} seconds. Generating blog...`);
              toast.success('Blog generation in progress...');
              const keywords = await fetchKeywords(videoId);
              if (keywords) await fetchPopularVideos(keywords);
              await generateBlog(videoId, isUploaded);
            } else {
              setMessage('Failed to transcribe the video.');
              setLoading(false);
              toast.error('Failed to transcribe the video.');
            }
          } else {
            setMessage('Failed to upload and transcribe the video.');
            setLoading(false);
            toast.error('Failed to upload and transcribe the video.');
          }
        }
      } catch (error) {
        console.error('Error processing request:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
        toast.error('An error occurred while processing your request.');
        setLoading(false);
      }
    }
  };

  // Helper function to generate the blog and handle polling for PDF
  const generateBlog = async (videoId, userUploadVideo) => {
    try {
      const generateResponse = await instance.post('/generate_pdf', {
        video_id: videoId,
        user_upload_video: userUploadVideo,
      });

      if (generateResponse.data.status === 200) {
        setMessage('Blog generation started. Please wait...');
        toast.info('Blog generation started. Please wait...');

        const interval = setInterval(async () => {
          const checkResponse = await instance.get(`/get_pdf_if_ready?video_id=${videoId}`);

          if (checkResponse.data.status === 200) {
            clearInterval(interval);
            const s3Link = checkResponse.data.data.s3_link;
            setPdfUrl(s3Link);
            setPdfReady(true);
            setMessage('Blog is ready! You can download it now.');
            toast.success('Blog is ready! You can download it now.');
            await sendEmailWithAttachment(s3Link);
            setLoading(false);
          } else {
            setMessage('Blog is still being generated. Please wait...');
          }
        }, 3000);
      } else {
        setMessage('Failed to initiate blog generation. Please try again.');
        toast.error('Failed to initiate blog generation.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error generating blog:', error);
      setMessage('An error occurred while generating the blog. Please try again later.');
      toast.error('An error occurred while generating the blog.');
      setLoading(false);
    }
  };

  // Function to send email with the generated PDF link
  const sendEmailWithAttachment = async (s3Link) => {
    try {
      const response = await instance.post('/send_email_with_attachment', {
        email: email,
        pdf_url: s3Link,
      });

      if (response.data.status === 200) {
        setMessage('The email with the Blog attachment has been sent successfully.');
        toast.success('Email with blog attachment sent successfully.');
      } else {
        setMessage('Failed to send the email. Please try again.');
        toast.error('Failed to send the email.');
      }
    } catch (error) {
      setMessage('An error occurred while sending the email. Please try again later.');
      toast.error('An error occurred while sending the email.');
    }
  };

  // Utility function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <Navigation />
      <ToastContainer /> {/* This renders the toast notifications on the page */}
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

        {/* Toggle between YouTube URL and video file upload */}
        <label>
          <input type="checkbox" checked={isUploading} onChange={handleToggle} />
          {isUploading ? 'Upload Video' : 'YouTube Video'}
        </label>

        {/* Render YouTube URL input if not uploading, or file input if uploading */}
        {isUploading ? (
          <div style={{ marginTop: '15px' }}>
            <label htmlFor="fileUpload">Upload your video file:</label>
            <input
              type="file"
              id="fileUpload"
              onChange={(e) => setUploadedFile(e.target.files[0])}
              required
              style={{
                display: 'block',
                margin: '10px auto',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            />
          </div>
        ) : (
          <div style={{ marginTop: '15px' }}>
            <label htmlFor="videoUrl">Enter YouTube video URL:</label>
            <input
              type="text"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL"
              required
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
        )}

        {/* Email input */}
        <div style={{ marginTop: '15px' }}>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        {/* Generate Blog button */}
        <button
          onClick={handleSubmit}
          disabled={loading || (!videoUrl && !uploadedFile)}
          style={{
            marginTop: '15px',
            backgroundColor: '#5cb85c',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Generate Blog'}
        </button>

        {/* Status messages */}
        <StatusMessage loading={loading} pdfReady={pdfReady} message={message} />
        {message && <p style={{ color: '#d9534f', fontSize: '1rem', marginTop: '15px' }}>{message}</p>}
        {estimatedTime && (
          <p style={{ color: '#5cb85c', fontSize: '1rem', marginTop: '15px' }}>
            Estimated transcription time: {estimatedTime} seconds
          </p>
        )}
        {pdfReady && <DownloadButton pdfUrl={pdfUrl} />}

        {/* Render popular video summaries */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Fetch videos based on keywords</h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            {videoSummaries.length > 0 ? (
              videoSummaries.map((video, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#fff',
                    padding: '15px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px',
                    flex: '1 1 calc(33.33% - 20px)',
                    maxWidth: '300px',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                  }}
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <img
                      src={video.high}
                      alt={video.title}
                      style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
                    />
                    <h4 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '5px' }}>
                      {video.title}
                    </h4>
                  </a>
                </div>
              ))
            ) : (
              <p>No videos found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default YouTube;
