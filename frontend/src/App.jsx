import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import SignIn from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import Workout from './pages/Workout';
import StudentDashboard from "./pages/StudentDashboard"; // ✅
import StaffDashboard from "./pages/StaffDashboard"; // ✅

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
