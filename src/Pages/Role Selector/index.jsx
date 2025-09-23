import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button from '../../Components/Button 1';
import Button2 from '../../Components/Button 2';

const RoleSelector = () => {

  const navigate = useNavigate();

  const handleLearnersignup = () => {
  navigate('/signup2', { state: { role: 'learner' } });
};

const handleSpeakersignup = () => {
  navigate('/signup2', { state: { role: 'speaker' } });
};

  return (
    <div style={styles.parentContainer}>
    <div style={styles.container}>
      {/* Header */}
      <Header/>

      {/* Grid Section */}
      <h1 style={{margin:'0px',color:'#e94e9f',fontSize:'32px', lineHeight:"1.2"}}>Select your role, Speaker or Learner...</h1>
<div style={{
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1, // This makes the div fill the available space
  width: '100%',
  gap: '15px',
  margin: 'auto 0', // This helps center it vertically within its parent
}}>
  <Button2 text="Learner" onClick={handleLearnersignup} />
  <Button2 text="Speaker" onClick={handleSpeakersignup} />
</div>
      {/* Main Text */}
      <div style={styles.textContainer}>
        <p style={styles.mainText}>
          Lorem ipsum dolor sit amet, consectetur
adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut
enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat.
        </p>
      </div>

      {/* Sign in button */}
      
    </div>
    </div>
  );
};

const styles = {
  parentContainer: {
      display: "flex",
      justifyContent: "center", /* This centers the child horizontally */
    },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#fff', // Matches home screen background
    boxSizing: 'border-box',
    maxWidth: '360px',
    marginRight:'35px',
    marginLeft:'35px',
    width:'100%',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '10px',
    paddingTop: '10px',
    marginBottom: '30px',
  },
  menuIcon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '24px',
    height: '18px',
    cursor: 'pointer',
  },
  menuLine: {
    width: '100%',
    height: '3px',
    backgroundColor: '#333',
    borderRadius: '2px',
  },
  gridSection: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexShrink: 1, 
    marginBottom: '30px',
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Slightly reduced gap
    backgroundColor: '#e0e0e0',
    borderRadius: '15px', // Slightly reduced border-radius
    padding: '15px', // Reduced padding
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    maxWidth: '300px', // Reduced max width
    width: '80%',
  },
  gridRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px', // Slightly reduced gap
  },
  gridItem: {
    width: 'calc(25% - 6px)', // Adjusted width for new gap
    aspectRatio: '1 / 1',
    backgroundColor: '#ffffff',
    borderRadius: '12px', // Slightly reduced border-radius
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  textContainer: {
    textAlign: 'center',
    marginBottom: '30px',
    maxWidth: '300px',
    flexShrink: 1, 
  },
  mainText: {
    fontSize: '12px',
    textAlign:"left",
    fontWeight: '600',
    lineHeight: '1.3',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  appleSignInButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '15px 30px',
    borderRadius: '15px',
    border: 'none',
    cursor: 'pointer',
    
    maxWidth: '350px',
    transition: 'background-color 0.3s ease',
  },
};

export default RoleSelector;