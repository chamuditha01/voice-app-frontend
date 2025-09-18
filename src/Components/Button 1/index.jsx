import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 100%;
  padding: 15px 20px;
  background-color: #000000ff; /* The pink color */
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 50px; /* Adjust to match the button's roundness */
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Adds a subtle shadow */
  transition: background-color 0.2s ease-in-out;
  text-transform: capitalize;
  
  &:hover {
    background-color: #000000ff;
  }

  &:active {
    background-color: #000000ff;
  }
`;

const Button = ({ text, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      {text}
    </StyledButton>
  );
};

export default Button;