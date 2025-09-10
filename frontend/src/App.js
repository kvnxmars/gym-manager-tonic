import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
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
      </Routes>
    </Router>
  );
}

export default App;
