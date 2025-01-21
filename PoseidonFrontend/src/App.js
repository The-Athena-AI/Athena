import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import { ClassProvider } from "./contexts/ClassContext";
import Navbar from "./components/Navbar";
import "./index.css";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Resources from "./pages/Resources";

function App() {
  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/resources" element={<Resources />} />
        <Route
          path="/student-dashboard/*"
          element={
            // <ProtectedRoute>
            <ClassProvider>
              <StudentDashboard />
            </ClassProvider>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard/*"
          element={
            // <ProtectedRoute>
            <ClassProvider>
              <TeacherDashboard />
            </ClassProvider>
            // </ProtectedRoute>
          }
        />
      </Routes>
    </UserAuthContextProvider>
  );
}

export default App;
