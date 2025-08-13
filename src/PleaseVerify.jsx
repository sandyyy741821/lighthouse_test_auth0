// src/PleaseVerify.jsx
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const PleaseVerify = () => {
  const {
    logout,
    user,
    getAccessTokenSilently,
    getAccessTokenWithPopup
  } = useAuth0();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setMessage('');

    try {
      let token;

      try {
        // Attempt silent token retrieval first
        token = await getAccessTokenSilently();
      } catch (silentError) {
        console.warn("Silent token failed, attempting popup...");
        // Fallback to popup
        token = await getAccessTokenWithPopup();
      }

      const res = await fetch('http://localhost:3001/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.sub }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Verification email sent!');
      } else {
        setMessage(data.error || '❌ Something went wrong.');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setMessage('❌ Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Verify Your Email</h2>
      <p>
        You must verify your email address before accessing the application.
        Please check your inbox and click the verification link.
      </p>

      <button onClick={handleResend} disabled={loading}>
        {loading ? 'Sending...' : 'Resend Verification Email'}
      </button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}

      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        style={{ marginTop: '1rem' }}
      >
        Logout
      </button>
    </div>
  );
};

export default PleaseVerify;
