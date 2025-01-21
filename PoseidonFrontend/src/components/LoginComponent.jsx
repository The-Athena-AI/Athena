import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useUserAuth } from "../context/UserAuthContext";

const LoginComponent = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const functions = getFunctions();
    const loginUser = httpsCallable(functions, "loginUser");
  
    try {
      const response = await loginUser({
        username: username || null,
        email: email || null,
        password
      });
  
      console.log(response.data.message);
  
      // Navigate to the appropriate dashboard based on the role
      if (response.data.role === "Student") {
        navigate("/student-dashboard/home");
      } else if (response.data.role === "Teacher") {
        navigate("/teacher-dashboard/home");
      }
  
      if (onClose) onClose(); // Close the login modal upon success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await googleSignIn(); // Sign in with Google
      const functions = getFunctions();
      const googleLogin = httpsCallable(functions, "googleLogin");
  
      const response = await googleLogin(); // No data needed; uses Firebase auth context
  
      console.log(response.data.message);
  
      // Navigate to the appropriate dashboard based on the role
      if (response.data.role === "Student") {
        navigate("/student-dashboard");
      } else if (response.data.role === "Teacher") {
        navigate("/teacher-dashboard");
      }
  
      if (onClose) onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          Welcome to Athena
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Unlock the wisdom of the gods
        </p>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-yellow-400"
            >
              Username
            </label>
            <input
              type="username"
              id="username"
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-yellow-400"
            >
              Email Address (optional)
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-yellow-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-400"
          >
            Log In
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">OR</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-500"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;