import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

// Create a context to share authentication data across the app
const AuthContext = createContext({});

// Custom hook to use auth context - makes it easy to access auth data anywhere
export function useAuth() {
  return useContext(AuthContext);
}

// This component provides authentication data to the entire app
export function AuthProvider({ children }) {
  // State variables to track user and loading status
  const [user, setUser] = useState(null);        // Store current user (null if not logged in)
  const [loading, setLoading] = useState(true);  // Track if we're still checking auth status

  // This function creates a new user account with email and password
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // This function logs in an existing user with email and password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // This function logs out the current user
  function logout() {
    return signOut(auth);
  }

  // This function sends a password reset email to the user
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // This runs when the component first loads
  // It listens for changes in the user's authentication status
  useEffect(() => {
    // Listen for authentication state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);        // Update user state
      setLoading(false);    // Stop loading
    });

    return unsubscribe; // Cleanup subscription when component unmounts
  }, []);

  // Create the value object that will be shared across the app
  const value = {
    user,           // Current user data
    signup,         // Function to create account
    login,          // Function to log in
    logout,         // Function to log out
    resetPassword,  // Function to reset password
    loading         // Whether we're still loading auth status
  };

  return (
    // Provide the auth data to all child components
    <AuthContext.Provider value={value}>
      {/* Only show the app when we're done loading auth status */}
      {!loading && children}
    </AuthContext.Provider>
  );
} 