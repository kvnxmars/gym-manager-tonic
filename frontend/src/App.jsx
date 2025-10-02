import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button, Card, CardContent, Typography, TextField, Grid } from '@mui/material';
import SignIn from "./pages/Auth/LoginPage";
import SignUp from "./pages/Auth/SignupPage";
import Workout from './pages/Workout/components/WorkoutApp';
import StudentDashboard from "./pages/HomePages/StudentDashboard";
import StaffDashboard from "./pages/HomePages/StaffDashboard";
import ClassBookings from "./pages/Class/ClassBooking";

function App() {
  return (
    <Router>
      <Routes>
        {/* MODIFICATION: Change the path="/" element to load StaffDashboard */}
        <Route path="/" element={<StaffDashboard />} /> 
       {/* <Route path="/" element={<SignIn />} /> */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/class-bookings" element={<ClassBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
