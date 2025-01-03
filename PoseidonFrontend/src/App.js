
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
import Features from "./pages/Features";

function App() {
  return (

        <UserAuthContextProvider>
            <Routes>
              <Route path="/" element={ <Home />}/>
              <Route path="features" element={<Features/>}/>
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
          </UserAuthContextProvider>
  );
}

export default App;
