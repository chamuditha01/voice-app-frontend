import logo from './logo.svg';
import './App.css';
import { Route,Routes,BrowserRouter } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard';
import PrivateRoute from './Components/PrivateRoute';
import LearnerDashboard from './Pages/LeanerDashboard';
import SpeakerDashboard from './Pages/SpeakerDashboard';


function App() {
  return (
    <div >
      <BrowserRouter>
         <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/learner-dashboard" element={
            <PrivateRoute requiredRole="learner">
              <LearnerDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/speaker-dashboard" element={
            <PrivateRoute requiredRole="speaker">
              <SpeakerDashboard />
            </PrivateRoute>
          } />

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;