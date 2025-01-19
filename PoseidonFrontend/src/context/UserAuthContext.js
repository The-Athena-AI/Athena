import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  function logIn(username, email, password) {
    return signInWithEmailAndPassword(
      auth, 
      username, 
      email,
      password
    );
  }
//   function signUp(email, password) {
//     return createUserWithEmailAndPassword(auth, email, password);
//   }
  function logOut() {
    return signOut(auth).then(() => {
      setUser(null);
    });
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    setUser,
    logIn,
    logOut,
    googleSignIn
  };

  return (
    <userAuthContext.Provider value={value}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}