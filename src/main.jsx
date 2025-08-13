// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import PleaseVerify from './PleaseVerify.jsx';
import Welcome from './welcome.jsx';
import Articles from './Articles.jsx';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: 'openid profile email'
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/please-verify" element={<PleaseVerify />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/articles" element={<Articles />} />
      </Routes>
    </BrowserRouter>
  </Auth0Provider>
);
