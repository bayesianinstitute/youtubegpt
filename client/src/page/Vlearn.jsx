import React, { useState, useEffect } from 'react'; // Import useEffect
import instance from '../config/instance'; // Axios instance for API requests
import StatusMessage from '../components/youtube/statusMessage'; // Ensure correct import path
import DownloadButton from '../components/youtube/downloadButton'; // Ensure correct import path
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import Navigation from '../components/landing/navigationYoutube'; // Ensure correct import path
import Footer from '../components/landing/footer'; // Import Footer component
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal'; // Import React Modal

const Vlearn = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null); // Handle file upload
  const [estimatedTime, setEstimatedTime] = useState(null); // Estimated time for transcription
  const [videoSummaries, setVideoSummaries] = useState([]); // eslint-disable-next-line no-unused-vars
  const [isUploading, setIsUploading] = useState(false); // Toggle between YouTube URL and upload
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const [hardcodedVideos] = useState([
    {
      videoid: '2qlcY9LkFik',
      high: 'https://img.youtube.com/vi/2qlcY9LkFik/hqdefault.jpg',
      title: 'Software Planning and Technical Documentation',
    },
    {
      videoid: 'SaCYkPD4_K0',
      high: 'https://img.youtube.com/vi/SaCYkPD4_K0/hqdefault.jpg',
      title: 'Software Development Life Cycle: Explained',
    },
    {
      videoid: 'vyQv563Y-fk',
      high: 'https://img.youtube.com/vi/vyQv563Y-fk/hqdefault.jpg',
      title: 'You probably won’t survive 2024... Top 10 Tech Trends',
    },
    {
      videoid: 'F_Riqjdh2oM',
      high: 'https://img.youtube.com/vi/F_Riqjdh2oM/hqdefault.jpg',
      title: 'Quantum Computing for Computer Scientists',
    },
    {
      videoid: 'hdI2bqOjy3c',
      high: 'https://img.youtube.com/vi/hdI2bqOjy3c/hqdefault.jpg',
      title: 'Building a Web App with React and Node.js',
    },
    {
      videoid: '5sLYAQS9sWQ',
      high: 'https://img.youtube.com/vi/5sLYAQS9sWQ/hqdefault.jpg',
      title: 'How Large Language Models Work',
    },
    {
      videoid: 'cfqtFvWOfg0',
      high: 'https://img.youtube.com/vi/cfqtFvWOfg0/hqdefault.jpg',
      title: 'Why Large Language Models Hallucinate',
    },
    {
      videoid: 'bBC-nXj3Ng4',
      high: 'https://img.youtube.com/vi/bBC-nXj3Ng4/hqdefault.jpg',
      title: 'Blockchain and Cryptocurrencies Explained',
    },
    {
      videoid: 'pX2zvfD6GCY',
      high: 'https://img.youtube.com/vi/pX2zvfD6GCY/hqdefault.jpg',
      title: 'Zuckerberg and Senator Hawley clash in fiery child safety hearing',
    },
    {
      videoid: 'X48VuDVv0do',
      high: 'https://img.youtube.com/vi/X48VuDVv0do/hqdefault.jpg',
      title: 'Introduction to Kubernetes',
    },
  ]);


  let cleanUrl;

  useEffect(() => {
    // Fetch email from token when component mounts
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log("Decoded TOken",decodedToken);
        setEmail(decodedToken.email);
      } else {
        // Provide a dummy email directly if no token is found
        setEmail('dummy@example.com'); // Use a dummy email for testing
        console.log('Using a dummy email for now');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      toast.error('Invalid token. Please log in.');
      // Optionally, set a fallback or dummy email for testing
      setEmail('fallback@example.com');
    }
  }, []);
  // Toggle between URL input and video upload input
  
  const handleToggle = () => {
    setIsUploading(!isUploading);
    setUploadedFile(null);
    setVideoUrl('');
    setEstimatedTime(null);
    setVideoSummaries([]); // Clear video summaries when switching modes
  };
  // Handle modal open and close
  const openModal = (videoId) => {
    setCurrentVideoId(videoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVideoId(null);
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

    // Function to update keywords in the database (Case 3)
  const updateKeywordsInDB = async (keywords) => {
      try {
        const response = await instance.post('http://127.0.0.1:5000/api/v1/user/updateKeywords', {
          email: email,
          keywords: keywords,
        });
        if (response.data.success) {
          console.log('Keywords updated successfully!');
        } else {
          console.error('Failed to update keywords in the database');
        }
      } catch (error) {
        console.error('Error updating keywords in the database:', error);
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
    // useEffect(() => {
    //   console.log('Fetching popular videos...');
    //   fetchPopularVideos('browse');
    // }, []); // Empty dependency array to run only on mount
  
  const handleSubmit = async (url, e = null) => {
    console.log(videoSummaries); 
    console.log('Submit',url, e);
      if (e) {
        e.preventDefault(); // Only prevent default if e is provided (i.e., from a form submission)
      }
    setVideoUrl(url);
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
  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

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
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>Vlearn</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#555', margin: '10px 0' }}>
          Simplify Your Video Learning Experience
        </h2>
        <h2 style={{ fontSize: '1.2rem', color: '#777', margin: '10px 0 20px' }}>
          Quickly transform videos into SEO-friendly articles using AI technology.
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
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {hardcodedVideos.map((video, index) => (
              <div key={index} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px', flex: '1 1 calc(33.33% - 20px)', maxWidth: '300px', textAlign: 'left', boxSizing: 'border-box' }}>
                <a href={`https://www.youtube.com/watch?v=${video.videoid}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={video.high} alt={video.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '5px' }}>{video.title}</h4>
                </a>

                {/* Play and Blog Buttons */}
                <button onClick={() => openModal(video.videoid)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Play
                </button>
                <button onClick={() => handleSubmit(`https://www.youtube.com/watch?v=${video.videoid}`)} 
                style={{ padding: '5px 10px', backgroundColor: '#0275d8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Blog
              </button>

              </div>
            ))}
          </div>
        </div>

        {/* Modal for Playing Video */}
        <Modal 
          isOpen={isModalOpen} 
          onRequestClose={closeModal} ariaHideApp={false}
          style={{
            content: {
              maxWidth: '80%',  // Responsive width
              width: '100%',
              height: 'auto',  // Allow auto height for responsiveness
              margin: '0 auto',  // Center the modal horizontally
              padding: '0',  // Remove unnecessary padding
              borderRadius: '8px',  // Add slight rounding to the modal
              border: 'none',  // Remove default border
              overflow: 'hidden',  // Prevent overflow outside the modal
              position: 'relative',  // Ensure "Close" button can be positioned absolutely
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',  // Add a background overlay
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',  // Center modal vertically and horizontally
            },
          }}
        >
          {/* Close button positioned below the video */}
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <button 
              onClick={closeModal} 
              style={{
                padding: '5px 10px', 
                backgroundColor: 'red', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '16px',
                borderRadius: '5px'
              }}
            >
              Close
            </button>
          </div>

          {/* Embed the YouTube video */}
          <div style={{ width: '100%', paddingBottom: '56.25%', position: 'relative' }}> {/* Aspect ratio for responsiveness */}
            <iframe
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${currentVideoId}`} 
              frameBorder="0" 
              allow="autoplay; encrypted-media" 
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',  // Make iframe responsive
              }}
              title={`YouTube video player for ${currentVideoId}`} 
            ></iframe>
          </div>
        </Modal>

      </div>
      <Footer />
    </div>
  );
};

export default Vlearn;