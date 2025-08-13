// src/Welcome.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const { user, logout } = useAuth0();

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>🎉 Welcome, {user.name}!</h2>
      <p>Your email is: {user.email}</p>

      <Link to="/articles">
        <button style={{ marginTop: '1rem' }}>Go to Articles</button>
      </Link>

      <br />
      <button
        style={{ marginTop: '1rem' }}
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      >
        Logout
      </button>
    </div>
  );
};

export default Welcome;
