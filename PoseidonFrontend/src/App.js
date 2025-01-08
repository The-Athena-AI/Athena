import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import GradingApp from "./components/Grading";
import Navbar from "./components/Navbar";
import "./index.css";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Features from "./pages/Features";
import { ClassProvider } from './contexts/ClassContext';

function App() {
  return (
    <UserAuthContextProvider>
      <ClassProvider>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/student-dashboard/*" element={<StudentDashboard />}/>
          <Route path="/teacher-dashboard/*" element={<TeacherDashboard />}/>
          <Route path="/features" element={<Features/>}/>
          <Route
            path="/grading"
            element={
              <ProtectedRoute>
                <GradingApp />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </ClassProvider>
    </UserAuthContextProvider>
  );
}

export default App;
