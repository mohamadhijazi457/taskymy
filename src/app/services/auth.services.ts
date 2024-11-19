import { Injectable, signal } from '@angular/core';
import { auth } from '../environments/firebase-configure';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getAuth, User } from 'firebase/auth';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to use the authToken globally
  user = signal<User | null>(null);

  authToken = signal<string | null>(null);
  // Global access to the auth status
  isAuthenticated = signal<boolean>(false);
  authError = signal<string | null>(null);

  constructor() {
    // updating signals with saved status and token
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        this.authToken.set(storedToken);
        this.isAuthenticated.set(true);
      }
    }
    getAuth().onAuthStateChanged((user) => {
      this.user.set(user);
      if (user) {
        this.isAuthenticated.set(true);
      } else {
        this.isAuthenticated.set(false);
        this.authToken.set(null);
      }
    });
  }

  async login(email: string, password: string) {
    this.authError.set(null); // Clear previous errors
    try {
      const userCredential = await this._signInWithEmailAndPassword(email, password);
      // Success flow
      const token = await this.getAuthToken(userCredential.user);
      this.authToken.set(token);
      this.isAuthenticated.set(true);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('authToken', token);
      }
      return userCredential;
    } catch (error) {
      // Error handling
      if (error instanceof Error) {
        if (error.message.includes('auth/invalid-credential')) {
          this.authError.set('Invalid credentials.');
        } else {
          this.authError.set('An unknown error occurred.');
        }
      } else {
        this.authError.set('An unknown error occurred.');
      }
      this.isAuthenticated.set(false);
      return;
    }
  }
  

  async signup(email: string, password: string) {
    this.authError.set(null);
    try {
      const userCredential = await this._createUserWithEmailAndPassword(email, password);
      // After creating user saving his auth token
      const token = await this.getAuthToken(userCredential.user);
      this.authToken.set(token);
      this.isAuthenticated.set(true);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('authToken', token);
      }
      return userCredential;
    } catch (error) {
      if (error instanceof Error) {
        // Handling errors here in service instead of the component
        if (error.message.includes('auth/email-already-in-use')) {
          this.authError.set('This email is already registered. Please use a different email.');
        }
        else {
          this.authError.set('An unknown error occurred.');
        }
      } else {
        this.authError.set('An unknown error occurred.');
      }
      this.isAuthenticated.set(false);
      return;
    }
  }

  async logout() {
    try {
      await this._signOut();
      this.authToken.set(null);
      this.isAuthenticated.set(false);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('authToken');
      }
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout', error);
    }
  }

  getUserEmailFromToken(): string | null {
    const token = this.authToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded?.email || null;
    }
    return null;
  }

  private async _signInWithEmailAndPassword(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  private async _createUserWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  private async _signOut() {
    return signOut(auth);
  }

  private async getAuthToken(user: User): Promise<string> {
    return user.getIdToken(true);
  }


  // In Firebase the auth token refreshes automatically
  // However this method was added for multiple options or to handle specific cases 
  async refreshAuthToken(): Promise<void> {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      this.authToken.set(token);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('authToken', token);
      }
    }
  }

  checkAuthentication(): boolean {
    return this.isAuthenticated();
  }

  getAuthTokenFromSignal(): string | null {
    return this.authToken();
  }

  onAuthStateChanged(callback: (user: User | null) => void): void {
    getAuth().onAuthStateChanged(callback);
  }
}
