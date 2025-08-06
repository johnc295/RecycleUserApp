import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVqMMaXzK4Hgcyo7-k3RxwAz80pfCtZDY",
  authDomain: "recycleapp-user.firebaseapp.com",
  projectId: "recycleapp-user",
  storageBucket: "recycleapp-user.firebasestorage.app",
  messagingSenderId: "424869783305",
  appId: "1:424869783305:web:da71a806088c2258d315d8",
  measurementId: "G-NGPFCJRSD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 