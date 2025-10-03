
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

   @media (min-width: 769px) {
    bottom: 10px; /* New value for desktop */
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 20px 20px;
  background-color: #f9e7f3;
  color: #e14e97;
  font-size: 20px;
  font-weight: normal;
  border: none;
  border-radius: 50px;
  cursor: pointer;

  transition: background-color 0.2s ease-in-out;
  text-transform: capitalize;
  font-family: 'Funnel Display', sans-serif;
  
  &:hover {
    background-color: #f9e7f3;
  }

  &:active {
    background-color: #f9e7f3;
  }
`;

const Button3 = ({ text, onClick }) => {
  const formattedText = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

  return (
    <ButtonContainer>
      <StyledButton onClick={onClick}>
        {formattedText}
      </StyledButton>
    </ButtonContainer>
  );
};

export default Button3;