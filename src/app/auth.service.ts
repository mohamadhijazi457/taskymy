import { Injectable } from '@angular/core';
import { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../environments/firebase-configure';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private app: FirebaseApp;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    console.log('Firebase App Initialized:', this.app);
    this.testFirebaseConnection();
  }

  testFirebaseConnection() {
    // Check if the Firebase app is correctly initialized
    if (this.app) {
      console.log('Firebase connection is successful!');
    } else {
      console.error('Firebase connection failed!');
    }
  }
}
