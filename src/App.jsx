import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
  const fetchTokenAndCallAPI = async () => {
    if (isAuthenticated && user?.email_verified) {
      try {
        const token = await getAccessTokenSilently();
        console.log('Access Token:', token);

        const res = await fetch('http://localhost:3001/api/your-endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: 'Hello from frontend!' }),
        });

        const data = await res.json();
        setBackendMessage(data.message || 'No message');
      } catch (error) {
        console.error('API call error:', error);
        setBackendMessage('API call failed.');
      }
    } else if (isAuthenticated && user && !user.email_verified) {
      // redirect to verify page
      window.location.href = '/please-verify';
    } else if (isAuthenticated && user?.email_verified) {
      window.location.href = '/welcome'; 
    }
  };

  fetchTokenAndCallAPI();
}, [isAuthenticated, getAccessTokenSilently, user]);


  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()} className='login' type='submit'>Login</button>
      ) : (
        <>
          <h2>Welcome, {user.name}</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>

          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Logout
          </button>

          <Link to="/articles">
            <button>Articles</button>
          </Link>

          <hr />
          <h3>Backend Response:</h3>
          <p>{backendMessage}</p>
        </>
      )}
    </div>
  );
}

export default App;
