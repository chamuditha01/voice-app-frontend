import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 100%;
  padding: 15px 20px;
  background-color: #e94e9f; /* The pink color */
  color: white;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 50px; /* Adjust to match the button's roundness */
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Adds a subtle shadow */
  transition: background-color 0.2s ease-in-out;
  text-transform: capitalize;
  
  &:hover {
    background-color: #e94e9f;
  }

  &:active {
    background-color: #e94e9f;
  }
`;

const Button2 = ({ text, onClick }) => {
  const formattedText = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

  return (
    <StyledButton onClick={onClick}>
      {formattedText}
    </StyledButton>
  );
};

export default Button2;