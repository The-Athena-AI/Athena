import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "../firebase";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  // Function to log in using Firebase Authentication and Cloud Function
  const logIn = async (username, email, password) => {
    const functions = getFunctions();
    const loginUser = httpsCallable(functions, "loginUser");

    try {
      const response = await loginUser({
        username: username || null,
        email: email || null,
        password,
      });

      console.log("Login response:", response.data);
      setUser(response.data.user); // Update the user state based on the response
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Function to sign up using Firebase Authentication and Cloud Function
  const signUp = async ({ username, name, email, password, role }) => {
    const functions = getFunctions();
    const registerStudent = httpsCallable(functions, "registerStudent");

    try {
      const response = await registerStudent({
        username,
        name,
        email: email || null,
        password,
        role,
      });

      console.log("Signup response:", response.data);
      setUser(response.data.user); // Update the user state based on the response
      return response.data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Function to log out
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  // Function for Google Sign-In
  const googleSignIn = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    const functions = getFunctions();
    const googleLogin = httpsCallable(functions, "googleLogin");

    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const response = await googleLogin();

      console.log("Google Sign-In response:", response.data);
      setUser(response.data.user); // Update the user state based on the response
      return response.data;
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
      throw error;
    }
  };

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User state updated:", currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    setUser,
    logIn,
    signUp,
    logOut,
    googleSignIn,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function UseUserAuth() {
  return useContext(UserAuthContext);
}
