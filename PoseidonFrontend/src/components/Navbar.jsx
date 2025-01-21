import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Logo from "../images/athena-high-resolution-logo-transparent.png";
import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
  };

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setNav(false); // Close the mobile menu
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex justify-between items-center h-20 max-w-[2000px] mx-auto px-6 text-black bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <a href="/">
          <img src={Logo} alt="Athena Logo" className="items-center h-8 w-auto mr-10" />
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-600 font-medium">
          <a href="/">
            <li className="p-2 hover:text-yellow-500 cursor-pointer transition duration-300">Home</li>
          </a>
          <a href="/features">
            <li className="p-2 hover:text-yellow-500 cursor-pointer transition duration-300">Features</li>
          </a>
          <a href="/resources">
            <li className="p-2 hover:text-yellow-500 cursor-pointer transition duration-300">Resources</li>
          </a>
          <a href="/pricing">
            <li className="p-2 hover:text-yellow-500 cursor-pointer transition duration-300">Pricing</li>
          </a>
        </ul>
      </div>

      {/* Login/Signup Buttons */}
      <div className="hidden md:flex space-x-4">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition duration-300"
        >
          Log in
        </button>
        <button
          onClick={handleSignupClick}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
        >
          Sign up
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Menu */}
      <ul
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full bg-white shadow-lg ease-linear duration-200 z-50"
            : "ease-linear h-full duration-200 z-50 fixed left-[-100%] top-0"
        }
      >
        <a href="/">
          <img src={Logo} alt="Athena Logo" className="h-8 w-auto mr-4 mt-6 ml-8" />
          <li className="p-4 mt-6 border-b hover:bg-gray-100">Home</li>
        </a>
        <a href="/features">
          <li className="p-4 border-b hover:bg-gray-100">Features</li>
        </a>
        <li className="p-4 border-b hover:bg-gray-100">Resources</li>
        <li className="p-4 border-b hover:bg-gray-100">Pricing</li>
        <li
          onClick={handleLoginClick}
          className="p-4 border-t hover:bg-gray-100 text-yellow-500 font-semibold cursor-pointer"
        >
          Log in
        </li>
        <li
          onClick={handleSignupClick}
          className="p-4 hover:bg-gray-100 text-yellow-500 font-semibold cursor-pointer"
        >
          Sign up
        </li>
      </ul>

      {/* Login Modal */}
      {showLogin && <LoginComponent onClose={handleCloseLogin} />}

      {/* Signup Modal */}
      {showSignup && <SignupComponent onClose={handleCloseSignup} />}
    </div>
  );
};

export default Navbar;
