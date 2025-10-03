
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 100%;
  padding: 20px 20px;
  background-color: #e14e97; /* The pink color */
  color: white;
  font-size: 20px;
  font-weight: normal;
  border: none;
  border-radius: 50px; /* Adjust to match the button's roundness */
  cursor: pointer;
  
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

const Button2 = ({ text, onClick }) => {
  const formattedText = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

  return (
    <StyledButton onClick={onClick}>
      {formattedText}
    </StyledButton>
  );
};

export default Button2;