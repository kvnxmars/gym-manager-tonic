import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//import { Button, Card, CardContent, Typography, TextField, Grid } from '@mui/material';
import SignIn from "./pages/Auth/LoginPage";
import SignUp from "./pages/Auth/SignupPage";
import Workout from './pages/Workout/WorkoutApp';
//import StudentDashboard from "./pages/HomePages/std/StudentDashboard";
import StaffDashboard from "./pages/HomePages/StaffDashboard";
import ClassBookings from "./pages/Class/ClassBooking";
import ErrorBoundary from "./components/ErrorBoundary";
//import Std from "./pages/HomePages/std/std";
import StudentDashboard from "./pages/HomePages/std/StudentDashboard";
import LandingPage from "./pages/landingPage";
//import AdminSignUp from "./pages/AdminSignup";
import ProfileApp from "./pages/profileApp/profileApp";


/*// Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const studentStr = JSON.parse(localStorage.getItem('student') || '{}');
  let student = {};
  console.log("Raw student data: ", studentStr);
  if(studentStr) {
    try {
      student = JSON.parse(studentStr);
    } catch (e) {
      console.error("Failed to parse student JSON:", studentStr, e);
      localStorage.removeItem('student')
    }
  }

  console.log("ProtectedRoute check:", {token, student, allowedRole })
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  
  
  return children;
}*/



function App() {
  return (
    <Router>
      <ErrorBoundary>
      <Routes>
        {/**Public Routes */}
        <Route path="/" element={<LandingPage/> } />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/**Protected Student Routes */}
        <Route 
        path="/student-dashboard" 
        element={
          
            <StudentDashboard /> 
          
        }
        />

        <Route 
          path="/workout" 
          element= {<Workout />}
         
              
            
          
          />

          <Route 
          path="/class-bookings" 
          element={
          
              <ClassBookings />
          }
          />

          <Route 
          path="/profile" 
          element={
          /*<ProtectedRoute allowedRole="student">*/
              <ProfileApp />
           /* </ProtectedRoute> */
          }
          />

          {/**Protected admin routes */}
          <Route 
          path="/staff-dashboard" 
          element={
          /*<ProtectedRoute allowedRole="admin">*/
              <StaffDashboard />
           /* </ProtectedRoute> */
          }
          />
          
        {/* Catch all - redirect to landing */}
        {/*<Route path="*" element={<Navigate to="/" replace />} />*/}
      </Routes>
      </ErrorBoundary>
    </Router>

  );
}

export default App;
