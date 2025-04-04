import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // for authentication
import { getFirestore } from 'firebase/firestore';

// Defining the Firebase configuration with appropriate types
export const firebaseConfig = {
  apiKey: '********************************',
  authDomain: 'taskymy.firebaseapp.com',
  projectId: 'taskymy',
  storageBucket: 'taskymy.firebasestorage.app',
  messagingSenderId: '***********************************',
  appId: '******************************************************',
  measurementId: '*************',
};

// Initialized Firebase with the provided configuration
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Firebase Authentication
export const firestore = getFirestore(app); // Firebase Firestore
