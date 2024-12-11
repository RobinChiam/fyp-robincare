import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthCheck = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/session', { withCredentials: true }); // Include credentials for cookies
        if (response.data.loggedIn) {
          setLoggedIn(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or placeholder
  }

  return loggedIn ? children : null;
};

export default AuthCheck;
