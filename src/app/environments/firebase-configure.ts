import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // for authentication
import { getFirestore } from 'firebase/firestore';

// Defining the Firebase configuration with appropriate types
export const firebaseConfig = {
  apiKey: 'AIzaSyCB5HZA2oek4kaUNj1zSxnxAVyW2BeANoE',
  authDomain: 'taskymy.firebaseapp.com',
  projectId: 'taskymy',
  storageBucket: 'taskymy.firebasestorage.app',
  messagingSenderId: '543037779817',
  appId: '1:543037779817:web:3d550795a1adba0e8c17f8',
  measurementId: 'G-GSPSY0MZSJ',
};

// Initialized Firebase with the provided configuration
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Firebase Authentication
export const firestore = getFirestore(app); // Firebase Firestore
