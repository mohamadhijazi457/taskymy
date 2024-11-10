// Import the necessary functions from Firebase SDK
import { initializeApp } from 'firebase/app';
import { FirebaseOptions, FirebaseApp } from 'firebase/app';

// Define the Firebase configuration with appropriate types
export const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCB5HZA2oek4kaUNj1zSxnxAVyW2BeANoE',
  authDomain: 'taskymy.firebaseapp.com',
  projectId: 'taskymy',
  storageBucket: 'taskymy.firebasestorage.app',
  messagingSenderId: '543037779817',
  appId: '1:543037779817:web:3d550795a1adba0e8c17f8',
  measurementId: 'G-GSPSY0MZSJ',
};

// Initialize Firebase with the provided configuration
const app: FirebaseApp = initializeApp(firebaseConfig);
