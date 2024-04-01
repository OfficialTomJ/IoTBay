import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  const style = {
    textAlign: 'center',
    marginTop: '50px',
  };

  const imgStyle = {
    maxWidth: '60%',
    height: 'auto',
    margin: '20px auto', 
    display: 'block', 
  };

  const linkStyle = {
    display: 'block', 
    marginTop: '20px',
    fontSize: '20px',
    color: '#007bff',
    textDecoration: 'none',
    padding: '10px 20px',
    border: '1px solid #007bff',
    borderRadius: '5px',
    margin: '20px auto', 
    width: 'fit-content', 
  };

  return (
    <div style={style}>
      <p style={{ fontSize: '24px' }}>404 Not Found</p>
      <img src={`${process.env.PUBLIC_URL}/404image.png`} alt="Error" style={imgStyle} />
      <Link to="/" style={linkStyle}>Return to welcomePage</Link>
    </div>
  );
};

export default ErrorPage;

