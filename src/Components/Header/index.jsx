import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  height: 100px;
  color: #333; // Adjust for the text color
  width: 100%;
  max-width: 450px; // To mimic the mobile view on a desktop
  margin: 0 auto;
  box-sizing: border-box;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -1px;
`;

const MenuIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 25px;
  height: 14px;
  cursor: pointer;
`;

const MenuLine = styled.div`
  width: 100%;
  height: 3px;
  background-color: #333;
  margin-left: auto; /* This line aligns it to the right */
`;

const MenuLine1 = styled.div`
  width: 70%;
  height: 3px;
  background-color: #333;
  margin-left: auto; /* This line aligns it to the right */
`;


  
const Header = () => {

  const navigate = useNavigate();

  const handleLogoClick = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      navigate('/update-profile', { state: { userEmail: userEmail } });
    } else {
      // If no email is found, redirect to login or home
      navigate('/login'); 
    }
  };

  return (
    <HeaderContainer>
      <h1 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
      talktu
    </h1>
      <MenuIcon>
        <MenuLine />
        <MenuLine1 />
      </MenuIcon>
    </HeaderContainer>
  );
};

export default Header;