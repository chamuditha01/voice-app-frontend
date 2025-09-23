import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 360px;
  box-sizing: border-box;
  z-index: 1000;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 20px 20px;
  background-color: #e14e97;
  color: white;
  font-size: 20px;
  font-weight: normal;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out;
  text-transform: capitalize;
  font-family: 'Funnel Display', sans-serif;

  &:hover {
    background-color: #e14e97;
  }

  &:active {
    background-color: #e14e97;
  }
`;

const Button4 = ({ text, onClick }) => {
  const formattedText = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

  return (
    <ButtonContainer>
      <StyledButton onClick={onClick}>
        {formattedText}
      </StyledButton>
    </ButtonContainer>
  );
};

export default Button4;