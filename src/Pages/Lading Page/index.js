import React from 'react';

const TalktuLandingPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.logo}>talktu</h1>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ff69b4', // A bright pink color
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // This makes the container take up the full height of the viewport
    width: '100vw',  // This makes the container take up the full width of the viewport
    margin: 0,
    padding: 0,
    fontFamily: 'sans-serif' // A clean, modern font
  },
  logo: {
    color: '#ffffff', // White
    fontSize: '4rem', // A large font size for the logo
    fontWeight: 'bold',
    textTransform: 'lowercase', // Ensures the text is lowercase, matching the image
    letterSpacing: '0.1rem' // Slight letter spacing for a cleaner look
  }
};

export default TalktuLandingPage;