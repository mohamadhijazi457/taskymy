import { Injectable, signal } from '@angular/core';
import { auth } from '../environments/firebase-configure'; // Firebase auth instance
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'; // Firebase auth methods
import { getAuth, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // Defining signals to manage the authentication state and token
  authToken = signal<string | null>(null); // To track the user token
  isAuthenticated = signal<boolean>(false); // To track if the user is authenticated

  constructor() {
    // Checking for existing token in localStorage and set it in signals if available
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        this.authToken.set(storedToken);
        this.isAuthenticated.set(true);
      }
    }
  }

  // Login method
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await this.getAuthToken(userCredential.user);
      this.authToken.set(token); // Update the token signal
      this.isAuthenticated.set(true); // Update the authenticated state signal
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('authToken', token); // Store token in localStorage
      }
      return userCredential;
    } catch (error) {
      console.error('Error during login', error);
      throw error;
    }
  }

  // Signup method
  async signup(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await this.getAuthToken(userCredential.user);
      this.authToken.set(token); // Update the token signal
      this.isAuthenticated.set(true); // Update the authenticated state signal
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('authToken', token); // Store token in localStorage
      }
      return userCredential;
    } catch (error) {
      console.error('Error during signup', error);
      throw error;
    }
  }

  // Logout method
  async logout() {
    try {
      await signOut(auth);
      this.authToken.set(null); // Reset the token signal
      this.isAuthenticated.set(false); // Reset the authenticated state signal
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('authToken'); // Remove token from localStorage
      }
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout', error);
    }
  }

  // Get Authentication Token
  private async getAuthToken(user: User): Promise<string> {
    try {
      const token = await user.getIdToken(true);  // Force token refresh
      return token;
    } catch (error) {
      console.error('Error getting token', error);
      throw error;
    }
  }

  // Refresh the token
  async refreshAuthToken(): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true); // Refresh token
        this.authToken.set(token); // Update the token signal
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('authToken', token); // Store updated token in localStorage
        }
      } catch (error) {
        console.error('Error refreshing token', error);
      }
    } else {
      console.log('No user is authenticated');
    }
  }

// Checking if the user is authenticated
    checkAuthentication(): boolean {
    return this.isAuthenticated(); // Getting the current value of the signal
    }
  

  // Geting the stored auth token from signals
  getAuthTokenFromSignal(): string | null {
    return this.authToken();
  }

  // Adding a listener to track the user’s authentication state
  onAuthStateChanged(callback: (user: User | null) => void): void {
    getAuth().onAuthStateChanged(callback);
  }
}
