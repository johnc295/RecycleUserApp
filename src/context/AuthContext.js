import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext({});

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create new user account
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Sign in existing user
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign out current user
  function logout() {
    return signOut(auth);
  }

  // Send password reset email
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription
  }, []);

  const value = {
    user,
    signup,
    login,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 