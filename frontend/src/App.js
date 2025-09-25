import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard"; // ✅
import StaffQRScanner from "./pages/StaffQRScanner"; // ✅
import ClassBooking from "./pages/ClassBooking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} /> {/* ✅ */}
        <Route path="/qr-scanner" element={<StaffQRScanner />} /> {/* ✅ */}
        <Route path="/book-class" element={<ClassBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
