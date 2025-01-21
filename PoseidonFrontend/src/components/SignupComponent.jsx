import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useUserAuth } from "../context/UserAuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignupComponent = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [name, setFirstLastname] = useState("");
  const [role, setRole] = useState(""); // New state for role selection
  const navigate = useNavigate();
  const { setUser } = useUserAuth();

  const handleSubmit = async (e) => {
    console.log("Form submitted!");

    e.preventDefault();
    setError("");
    const registerStudent = httpsCallable(getFunctions(), "registerStudent");

    try {
      // Add console log to verify the role being sent
      console.log('Role being sent:', role);
      
      const response = await registerStudent({
        username,
        name,
        email: email.trim() === "" ? null : email,
        password,
        role,
      });
      
      console.log('Response from registration:', response.data);


      // Navigate to the appropriate dashboard based on the role
      if (role === "Student") {
        navigate("/student-dashboard/home");
      } else if (role === "Teacher") {
        navigate("/teacher-dashboard/home");
      }

      if (onClose) onClose();
    } catch (error) {
      console.error("Error from Cloud Function:", error);
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          Create Your Account
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Join the Athena platform today
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
              type="text"
              id="username"
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Create a username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="firstLastName"
              className="block text-sm font-medium text-yellow-400"
            >
              Name
            </label>
            <input
              type="text"
              id="firstLastName"
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setFirstLastname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-yellow-400"
            >
              Email Address (Optional for Students)
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-yellow-400">
              Select Your Role
            </label>
            <div className="flex space-x-4 mt-2">
              <button
                type="button"
                className={`w-full py-2 rounded-md ${
                  role === "Student"
                    ? "bg-yellow-400 text-black"
                    : "bg-black text-white"
                } border border-gray-600 hover:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-400`}
                onClick={() => setRole("Student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`w-full py-2 rounded-md ${
                  role === "Teacher"
                    ? "bg-yellow-400 text-black"
                    : "bg-black text-white"
                } border border-gray-600 hover:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-400`}
                onClick={() => setRole("Teacher")}
              >
                Teacher
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-400"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupComponent;
