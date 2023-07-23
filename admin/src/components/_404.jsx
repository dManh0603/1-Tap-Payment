import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const _404 = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // Clean up the timer when the component is unmounted to avoid memory leaks
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/dashboard');
    }
  }, [countdown, navigate]);

  return (
    <div>
      <div>404 Not found</div>
      <div>Return to "Dashboard" in {countdown} seconds</div>
    </div>
  );
};

export default _404;
