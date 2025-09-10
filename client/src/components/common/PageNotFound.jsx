import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImage from '../../assets/img/not-found.gif';  

function PageNotFound() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',  // light neutral background
        color: '#333', // dark text for good contrast
      }}
    >
      <img
        src={notFoundImage}
        alt="Page Not Found"
        style={{
          maxWidth: '80vw',
          maxHeight: '40vh',
          width: 'auto',
          height: 'auto',
          marginBottom: '1.5rem',
          objectFit: 'contain',
        }}
      />
      <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Oops!! The page you are looking for doesn't exist!
      </h4>
      <p
        style={{
          maxWidth: '320px',
          fontSize: '1rem',
          margin: '0 auto 1.5rem auto',
          color: '#555',
          lineHeight: '1.4',
        }}
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          padding: '0.5rem 1.25rem',
          borderRadius: '0.25rem',
          fontWeight: '600',
          fontSize: '1rem',
          transition: 'background-color 0.3s ease',
          display: 'inline-block',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0056b3'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#007bff'; }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default PageNotFound;

