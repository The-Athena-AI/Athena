import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp } from "firebase-admin/app";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

// Initialize Firebase Admin SDK

initializeApp();

const db = getFirestore();
const auth = getAuth();
console.log("Logging for firebase functions to work with google containers");

export const registerStudent = onCall(async (request) => {
  const { username, name, email, password, role } = request.data;

  if (!username || !name || !password || !role) {
    throw new HttpsError("invalid-argument", "All fields except email are required.");
  }

  try {
    let userId;

    if (email) {
      // Create user with Firebase Auth if email is provided
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
      userId = userRecord.uid;
    } else {
      // Generate unique ID if no email
      userId = db.collection("Users").doc().id;
    }

    // Save user metadata in Firestore - Note the lowercase field names
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("Users").doc(userId).set({
      userName: username,
      name: name,
      role: role,
      email: email || null,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      enrolledClasses: {},
      classes: {}
    });

    return { message: "User registered successfully", uid: userId };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new HttpsError("internal", error.message || "Registration failed.");
  }
});


export const loginUser = onCall(async (request) => {
  const { username, email, password } = request.data;

  if (!username && !email) {
    throw new HttpsError("invalid-argument", "Either email or username must be provided.");
  }

  try {
    let resolvedEmail = email;
    let userDoc;

    // Resolve email if username is provided
    if (username) {
      const userSnapshot = await db.collection("Users").where("userName", "==", username).get();
      if (userSnapshot.empty) {
        throw new HttpsError("not-found", "Username not found.");
      }

      // Extract email and user document data
      const userData = userSnapshot.docs[0].data();
      resolvedEmail = userData.Email;
      userDoc = userSnapshot.docs[0];
    }

    if (!resolvedEmail) {
      // If no email is resolved, validate using Firestore directly (for non-email users)
      if (!userDoc) {
        throw new HttpsError("not-found", "User metadata not found.");
      }

      // Password validation
      const isPasswordValid = await bcrypt.compare(password, userDoc.data().Password);
      if (!isPasswordValid) {
        throw new HttpsError("unauthenticated", "Invalid password.");
      }

      return { message: "Login successful", role: userDoc.data().Role };
    }

    // Use Firebase Admin SDK to validate email/password
    const userRecord = await auth.getUserByEmail(resolvedEmail);
    const userDocInFirestore = await db.collection("Users").doc(userRecord.uid).get();

    if (!userDocInFirestore.exists) {
      throw new HttpsError("not-found", "User metadata not found.");
    }

    // Password validation
    const isPasswordValid = await bcrypt.compare(password, userDocInFirestore.data().Password);
    if (!isPasswordValid) {
      throw new HttpsError("unauthenticated", "Invalid password.");
    }

    return { message: "Login successful", role: userDocInFirestore.data().Role };
  } catch (error) {
    console.error("Login error:", error);
    throw new HttpsError("internal", error.message || "Login failed.");
  }
});


export const googleLogin = onCall(async (request) => {
  const googleUser = request.auth;
  if (!googleUser) {
    throw new HttpsError("unauthenticated", "Google login failed.");
  }

  const googleEmail = googleUser.token.email;

  try {
    // Check if user exists in Firestore
    const userSnapshot = await db.collection("Users").where("Email", "==", googleEmail).get();
    if (userSnapshot.empty) {
      throw new HttpsError("not-found", "Google account not registered.");
    }

    const userData = userSnapshot.docs[0].data();
    return { message: "Login successful", role: userData.Role };
  } catch (error) {
    console.error("Google login error:", error);
    throw new HttpsError("internal", error.message || "Google login failed.");
  }
});
