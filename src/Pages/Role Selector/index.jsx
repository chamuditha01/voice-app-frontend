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
    <div className="parentContainer">
    <div className="container">
        {/* Header */}
        <Header/>

        {/* Title */}
        <h1 
            style={{
                margin: '0px',
                color: '#e94e9f',
                fontSize: '32px', 
                lineHeight: "1.2"
            }}
        >
            Select your role, Speaker or Learner...
        </h1>

        {/* Buttons Section (Centered) */}
        <div 
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1, /* This makes the div fill the available space */
                width: '100%',
                gap: '15px',
                margin: 'auto 0', /* This helps center it vertically within its parent */
            }}
        >
            <Button2 text="Learner" onClick={handleLearnersignup} />
            <Button2 text="Speaker" onClick={handleSpeakersignup} />
        </div>

        {/* Main Text */}
        <div className="textContainer">
            <p className="mainText">
                Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
            </p>
        </div>
        
        {/* Sign in button (assuming this was part of the original component but removed from the snippet) */}
    </div>
</div>
  );
};


export default RoleSelector;