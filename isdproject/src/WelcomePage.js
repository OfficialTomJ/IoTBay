import React from 'react';
import { Link } from 'react-router-dom'; //Import Link component
import NavigationBar from './components/NavigationBar'; 

//image address
const imageUrl = '/1.png';

function WelcomePage() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'left',
    backgroundColor: '#FFFFFF',
    padding: '0 10%',
    color: '#0047ab',
    marginTop: '4rem', // Make space for navigation bar
  };

  const textContainerStyle = {
    maxWidth: '40%',
  };

  const helloStyle = {
    fontSize: '152px',
    margin: '0 0 24px 0',
    fontWeight: 'bold',
  };

  const seeYouStyle = {
    fontSize: '44px',
    margin: '0 0 24px 0',
  };

  const startButtonStyle = {
    padding: '12px 24px',
    fontSize: '18px',
    backgroundColor: '#0047ab',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    outline: 'none',
  };

  const imageStyle = {
    height: '100%',
    width: 'auto',
    objectFit: 'cover',
    maxHeight: '1000px',
    maxWidth: '1000px',
  };

  return (
    <div>
      <NavigationBar />
      <div style={containerStyle}>
        <div style={textContainerStyle}>
          <h1 style={helloStyle}>Hello!</h1>
          <p style={seeYouStyle}>Go to see you here</p>
          <Link to="/product" style={startButtonStyle}>Go to Start</Link>
        </div>
        <div>
          <img src={imageUrl} alt="Decorative" style={imageStyle} />
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;

