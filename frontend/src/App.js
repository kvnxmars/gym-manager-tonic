import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import our auth pages
import SignUpPage from "./pages/SignupPage";
//import SignInPage from "./pages/SignInPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → redirect to signin */}
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Auth routes */}
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Fallback for unknown routes → go to signin */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
