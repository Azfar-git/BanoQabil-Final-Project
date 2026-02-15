import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../firebase/config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          let userData = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "User",
            role: "student",
            roleName: "student",
          };
          if (userDoc.exists()) {
            const data = userDoc.data();
            userData = {
              ...userData,
              name: data.name || data.displayName || userData.name,
              role: data.roleName || userData.role,
              roleName: data.roleName || userData.roleName,
              // include any other fields from Firestore
            };
          }
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to basic auth data
          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "User",
            role: "student",
            roleName: "student",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up new user
  const signUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName: name });
      // Create user document in Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        name,
        email,
        roleName: "student", // default role
        createdAt: new Date().toISOString(),
        enrolledClasses: [],
      });
      // User will be set by onAuthStateChanged
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  // Sign in existing user
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User will be set by onAuthStateChanged
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
      // User will be set to null by onAuthStateChanged
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut: signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}