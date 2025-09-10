import '../css/Loading.css';
import { useEffect, useState } from 'react';

export default function Loading({ message = "Loading..." }) {
  const [loadTime, setLoadTime] = useState(0);
  const [wakingServerMessage, setWakingServerMessage] = useState(false);

  // If loading takes more than 5 seconds, assume the Render servers are waking up and display
  // a message asking the user to wait for up to one minute
  useEffect(() => {
    if(!wakingServerMessage) {
      const interval = setInterval(() => {
        setLoadTime(prev => prev + 1);
        if (loadTime >= 5) {
          setWakingServerMessage("Servers are starting up — this can take up to a minute. Thanks for your patience!");
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  },[loadTime]);

  return (
    <>
    {/* Render loading elements */}
      <div className="loading__container">
        <div className="loading__spinner"></div>
        {message && <p className="loading__message">{message}</p>}
        {wakingServerMessage && <p className="loading__message">{wakingServerMessage}</p>}
      </div>
    </>
  );
}