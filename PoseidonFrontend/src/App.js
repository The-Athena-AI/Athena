import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import "./styles/theme.css";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Resources from "./pages/Resources";
import Callback from "./components/Callback";
import ProtectedRoute from "./components/ProtectedRoute";
import { themeV1, generateCSSVariables } from './styles/themes';

function App() {
  useEffect(() => {
    // Apply initial theme
    const style = document.createElement('style');
    style.setAttribute('id', 'theme-vars');
    style.textContent = generateCSSVariables(themeV1, 'light');
    document.head.appendChild(style);
    document.documentElement.setAttribute('data-theme', 'light');

    return () => {
      const existingStyle = document.getElementById('theme-vars');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen themed-bg transition-all duration-200">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/auth/callback" element={<Callback />} />
        <Route 
          path="/teacher/:userId/dashboard/*" 
          element={
            <ProtectedRoute requiredRole="Teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/:userId/dashboard/*" 
          element={
            <ProtectedRoute requiredRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
