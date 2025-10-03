
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  height: 100px;
  color: #333;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  margin-bottom: 25px;
  box-sizing: border-box;
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
  margin-left: auto;
`;

const MenuLine1 = styled.div`
  width: 70%;
  height: 3px;
  background-color: #333;
  margin-left: auto;
`;

// New styled component for the close icon
const CloseIcon = styled.div`
  cursor: pointer;
  position: relative;
  width: 25px;
  height: 25px;
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 25px;
    height: 3px;
    background-color: #333;
  }
  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

const Header = ({ showCloseButton, onClose }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    if (userEmail) {
      if (userRole === 'learner') {
        navigate('/speakers');
      } else if (userRole === 'speaker') {
        navigate('/sp-dashboard');
      } else {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = () => {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    if (!userEmail || !userRole) {
      navigate('/login');
      return;
    }
    navigate('/menu');
  };

  return (
    <HeaderContainer>
      <div onClick={handleLogoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <svg
          id="reference-one"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 564 142"
          style={{ width: '100px', height: '40px' }}
        >
          <defs>
            <style>
              {`
                .st0 {
                  fill: #333;
                }
              `}
            </style>
          </defs>
          <path className="st0" d="M39.8,140.2c-7.1,0-12.7-1.8-16.6-5.4-3.9-3.6-5.9-9.1-5.9-16.6v-56.4H.1v-21.7h17.5V10h27v30h23.2v21.7h-22.9v56.7h25.2v21.7h-30.4Z"/>
          <path className="st0" d="M117.6,142c-11.8,0-21-2.9-27.7-8.6-6.7-5.7-10-13.3-10-22.6s3.4-17.5,10.3-22.9c6.9-5.3,16.8-8,29.7-8h28.7v-3.8c0-10.8-6.5-16.2-19.4-16.2s-18,3.9-20.4,11.7h-27.5c2.2-11,7.4-19.4,15.5-25,8.1-5.7,18.9-8.5,32.4-8.5s26.3,3.3,34.1,10c7.8,6.7,11.8,16.4,11.8,29.2v35.5h13v27.4h-28v-16.3h-7c-3.4,5.8-8.1,10.3-13.8,13.4-5.8,3.2-13,4.8-21.7,4.8ZM121.8,121c5.2,0,9.8-.9,13.8-2.8,4-1.9,7.2-4.4,9.5-7.6,2.3-3.2,3.5-6.8,3.5-10.8v-1.5h-27.4c-10,0-15,3.7-15,11.2s1.4,6.5,4.2,8.5c2.8,2,6.6,3,11.3,3Z"/>
          <path className="st0" d="M205.5,140.2V0h27.7v140.1h-27.7Z"/>
          <path className="st0" d="M255.6,140.2V0h27.7v75.9h.7l39.4-35.9h33l-42.5,38.4,45.7,61.7h-32.4l-32.9-44.9-11,9v35.9h-27.7Z"/>
          <path className="st0" d="M403.9,140.2c-7.1,0-12.7-1.8-16.6-5.4-3.9-3.6-5.9-9.1-5.9-16.6v-56.4h-17.2v-21.7h17.5V10h27v30h23.2v21.7h-22.9v56.7h25.2v21.7h-30.4Z"/>
          <path className="st0" d="M491.6,142c-13.9,0-24.6-3.7-32-11-7.5-7.3-11.2-17.4-11.2-30v-60.9h27.7v55.6c0,7.2,1.9,12.7,5.6,16.3,3.7,3.6,9.3,5.4,16.8,5.4s13.6-1.9,17.8-5.8c4.2-3.9,6.3-9.5,6.3-16.7v-54.7h27.7v72.7h13.7v27.4h-28v-16.3h-7c-4,5.9-8.9,10.4-14.6,13.5-5.7,3.1-13.3,4.7-22.6,4.7Z"/>
        </svg>
      </div>
      {showCloseButton ? (
        <CloseIcon onClick={onClose} />
      ) : (
        <div onClick={handleMenuClick}>
          <MenuIcon>
            <MenuLine />
            <MenuLine1 />
          </MenuIcon>
        </div>
      )}
    </HeaderContainer>
  );
};

export default Header;