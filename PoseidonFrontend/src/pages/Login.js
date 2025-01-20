import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-yellow-400 text-center">Welcome to Athena</h2>
        <p className="text-center text-gray-300 mt-2">Unlock the wisdom of the gods</p>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-yellow-400">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-yellow-400">Password</label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
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

        <p className="text-center text-gray-300 mt-6">
          Don't have an account? <Link to="/signup" className="text-yellow-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
