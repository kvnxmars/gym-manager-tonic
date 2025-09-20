import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import SignIn from "./pages/Auth/LoginPage";
import SignUp from "./pages/Auth/SignupPage";
import Workout from './pages/Workout/components/WorkoutApp';
import StudentDashboard from "./pages/HomePages/StudentDashboard"; // ✅
import StaffDashboard from "./pages/HomePages/StaffDashboard"; // ✅

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} /> {/* ✅ */}
        <Route path="/staff-dashboard" element={<StaffDashboard />} /> {/* ✅ */}
        <Route path="/workout" element={<Workout />} /> 
      </Routes>
    </Router>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
