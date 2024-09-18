import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './page/home';
import YouTube from './page/YouTube';
import Signup from './page/signup';
import Signin from './page/signin';
import ResetPassword from './page/resetPassword.jsx';
import ForgotPassword from './page/forgotpassword';
import ProtectedRoute from './components/protectedRoute.jsx';
import About from './page/about.jsx';
import Feature from './page/features.jsx';
import Testimonials from './page/testimonials.jsx';
import Contact from './page/contact.jsx';
import { Toaster } from 'react-hot-toast'; // Import Toaster instead of ToastContainer

function App() {
  const [isAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div className="App">
        {/* Include the Toaster to display toast notifications */}
        <Toaster position="top-right" reverseOrder={false} />
        
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Home />} />
          
          {/* Protected Route for YouTube */}
          <Route 
            path="/youtube" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/signin">
                <YouTube />
              </ProtectedRoute>
            } 
          />
          
          {/* Conditional Rendering of Auth Routes */}
          {!isAuthenticated ? (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/reset/:token" element={<ResetPassword />} />
            </>
          ) : (
            // Redirect authenticated users away from auth pages
            <>
              <Route path="/signup" element={<Navigate to="/youtube" />} />
              <Route path="/signin" element={<Navigate to="/youtube" />} />
              <Route path="/forgotpassword" element={<Navigate to="/youtube" />} />
              <Route path="/reset/:token" element={<ResetPassword />} />
            </>
          )}
          
          {/* Other routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Feature />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
