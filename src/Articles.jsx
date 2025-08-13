// src/Articles.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Articles = () => {
  const dummyArticles = [
    { id: 1, title: 'How to Build with React', summary: 'React makes building UIs simple and declarative.' },
    { id: 2, title: 'Auth0 + React Integration', summary: 'Secure your app using Auth0 with React.' },
    { id: 3, title: 'Handling Tokens Securely', summary: 'Use Silent Auth or Popup to retrieve tokens.' },
  ];

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>📚 Articles</h2>
      {dummyArticles.map((article) => (
        <div key={article.id} style={{ marginBottom: '1rem' }}>
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
        </div>
      ))}

      <Link to="/">
        <button>Back to Welcome</button>
      </Link>
    </div>
  );
};

export default Articles;
