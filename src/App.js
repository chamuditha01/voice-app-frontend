z
import './App.css';
import { Route,Routes,BrowserRouter } from 'react-router-dom';
import Signup from './Pages/Signup';
import PrivateRoute from './Components/PrivateRoute';
import SpeakerDashboard from './Pages/SpeakerDashboard';
import { useEffect,useState } from 'react';
import TalktuLandingPage from './Pages/Lading Page';
import HomeScreen from './Pages/Grid Page';
import LoginPage from './Pages/Login';
import ProfileScreen from './Pages/Speaker Selection';
import CallScreen from './Pages/OnCall';
import ReviewForm from './Pages/ReviewForm';
import RoleSelector from './Pages/Role Selector';
import Register from './Pages/Signup/index2';
import SpeakerDashboard2 from './Pages/SpeakerDashboard/index2';
import UpdateProfile from './Pages/UpdateProfile';
import MenuPage from './Pages/Menu Page';
import SpeakerDashboard3 from './Pages/SpeakerDashboard/index3';
import LearnerDashUpdate from './Pages/LeanerDashboard';





function App() {


  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 3000); // 3-second delay before showing the login form

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const styles = {
  // Main container for the entire screen
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', 
    backgroundColor: '#f0f2f5',
    overflow: 'hidden', // Prevents vertical scrolling
  },
  // Other styles for content sections
  // ...
};

  return (
    <div >
      <BrowserRouter>
         <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
          showLogin ? <HomeScreen /> : <TalktuLandingPage/>
        } />
          
          {/* Protected routes */}
          <Route path="/learner-" element={
            <PrivateRoute requiredRole="learner">
              
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/speaker-dashboard" element={
            <PrivateRoute requiredRole="speaker">
              <SpeakerDashboard />
            </PrivateRoute>
          } />

          <Route path="/speakers" element={<ProfileScreen/>} />
          <Route path="/talk" element={<CallScreen />} />
          <Route path="/review" element={<ReviewForm />} />
          <Route path="/signup1" element={<RoleSelector />} />
          <Route path="/signup2" element={<Register />} />
          <Route path="/sp-dashboard" element={<SpeakerDashboard2 />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path='/speakerdashboard' element={<SpeakerDashboard3/>} />
          <Route path='/learnerdashboard' element={<LearnerDashUpdate/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;