import React from 'react';
import NavigationBar from './components/NavigationBar'; 
import { Link } from 'react-router-dom'; 

const LogoutPage = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: '#0047ab',
  };

  const textStyle = {
    fontSize: '24px',
    margin: '20px 0',
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '18px',
    backgroundColor: '#0047ab',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    outline: 'none',
    textDecoration: 'none',
  };

  return (
    <div>
      <NavigationBar />
      <div style={containerStyle}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>You have been logged out</h1>
        <p style={textStyle}>Thank you for visiting. We hope to see you again soon!</p>
        <Link to="/" style={buttonStyle}>Go to Home</Link> 
      </div>
    </div>
  );
}

export default LogoutPage;

