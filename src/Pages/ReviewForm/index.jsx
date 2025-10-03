import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2';
import Button3 from '../../Components/Button 3';

// Placeholder data for profiles
const profiles = [
  {
    name: 'Peter',
    age: 59,
    country: 'United Kingdom',
    description: 'A cool guy with a beard, talks beers...',
    imageUrl: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', // Placeholder image for Peter
  },
  {
    name: 'Anna',
    age: 32,
    country: 'Canada',
    description: 'Loves hiking and photography.',
    imageUrl: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', // Placeholder for another profile
  },
  {
    name: 'Carlos',
    age: 45,
    country: 'Mexico',
    description: 'Enjoys cooking and live music.',
    imageUrl: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', // Placeholder for another profile
  },
];

const ReviewForm = () => {
  const [currentProfileIndex, ] = useState(0);
  const navigate = useNavigate();
  const currentProfile = profiles[currentProfileIndex];

 
  // This function is for navigating to the 'talk' page when the button is clicked
  const handleskipClick = () => {
    navigate('/speakers', { state: { profile: currentProfile } });
  };

  return (
    <div style={styles.outerContainer}>
      {/* Header */}
      <Header/>

    <div style={{display:'flex',flexDirection:'row',justifyContent:"space-between",alignItems:'left',width:'100%'}}>
        <div>
            <h1 style={{margin:'0px',color:'#000000ff'}}>Rate Michelle</h1>
        </div>
        <div>
            <img src="https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" width={'50px'} height={'50px'} style={{borderRadius:'10px', objectFit:'cover'}} alt='Profile' />
        </div>
    </div>
    <div style={{marginTop:'25%',marginBottom:'25%',textAlign:'center',width:'100%'}}>

        <div style={{
      width: '80%',
      backgroundColor: '#facce4ff',
      height: '10px', // Note: This height will make the stars squished. You'll likely want to adjust it.
      margin: '0px auto',
      padding: '20px',
      borderRadius: '25px',
      display: 'flex',       // Added for Flexbox to arrange stars
      justifyContent: 'space-around', // Added to space out stars
      alignItems: 'center'   // Added to vertically center stars if container height is larger
    }}>
      {/* Star 1 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#e94e9f" // Pink color
        stroke="#e94e9f"
        strokeWidth="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ margin: '0 2px' }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>

      {/* Star 2 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#e94e9f" // Pink color
        stroke="#e94e9f"
        strokeWidth="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ margin: '0 2px' }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>

      {/* Star 3 (Filled) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#e94e9f" // Pink color
        stroke="#e94e9f"
        strokeWidth="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ margin: '0 2px' }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>

      {/* Star 4 (Empty/White for example) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#fff" // White color
        stroke="#fff"
        strokeWidth="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ margin: '0 2px' }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>

      {/* Star 5 (Empty/White for example) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#fff" // White color
        stroke="#fff"
        strokeWidth="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ margin: '0 2px' }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </div>
        <div style={{width:'80%', backgroundColor:'#facce4ff',margin:'0px auto',padding:'20px',borderRadius:'25px',height:'80px',marginTop:'20px'}}>
           <textarea 
  placeholder="Submit a review..." 
  style={{
    width: '100%', 
    border: 'none', 
    outline: 'none', 
    fontSize: '18px', 
    backgroundColor: '#facce4ff',
    resize: 'none', // Prevents the user from resizing the textarea
    padding: '10px' // Adds some internal spacing
  }} 
/></div>
    </div>

      {/* Action Button */}
      <Button3 text={`Skip`} onClick={handleskipClick} />
      <br></br>
      <Button2 text={`Submit Review`} onClick={handleskipClick} />
    </div>
  );
};

// Styles remain the same
const styles = {
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    
    boxSizing: 'border-box',
    maxWidth: '360px',
    minWidth: '360px',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    marginBottom: '20px',
    maxWidth: '400px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'lowercase',
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
    backgroundColor: '#000',
    borderRadius: '2px',
  },
  profileCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
    height: '70vh',
    maxWidth: '400px',
    marginBottom: '20px',
  },
  profileDescription: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: '30px',
    lineHeight: '1.2',
    textAlign: 'left',
    width: '100%',
    paddingLeft: '10px',
  },
  imageContainer: {
    width: '80%',
    height:'100%',
    
    backgroundColor: '#ffdb9d',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px',
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '20px',
  },
  infoContainer: {
    width: '100%',
    textAlign: 'left',
    marginBottom: 'auto',
    paddingLeft: '10px',
  },
  nameAndAge: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  country: {
    fontSize: '18px',
    color: '#777',
    marginBottom: 'auto',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  talkButton: {
    backgroundColor: '#ff69b4',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '15px 30px',
    borderRadius: '15px',
    border: 'none',
    cursor: 'pointer',
    width: 'calc(100% - 40px)',
    maxWidth: '350px',
    transition: 'background-color 0.3s ease',
  },
};

export default ReviewForm;