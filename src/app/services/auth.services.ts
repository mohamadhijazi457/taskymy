import { Injectable, signal } from '@angular/core';
import { auth } from '../environments/firebase-configure';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAuth, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
//
export class AuthService {
  // Signal to use the authToken globally
  authToken = signal<string | null>(null);
  // Global access to the auth status
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // updating signals with saved status and token
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        this.authToken.set(storedToken);
        this.isAuthenticated.set(true);
      }
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await this._signInWithEmailAndPassword(email, password);
      // accessing the user token
      const token = await this.getAuthToken(userCredential.user);
      // updating signals
      this.authToken.set(token);
      this.isAuthenticated.set(true);
      if (typeof window !== 'undefined' && window.localStorage) {
        // saving the auth token to local storage
        localStorage.setItem('authToken', token);
      }
      return userCredential;
    } catch (error) {
      console.error('Error during login', error);
      throw error;
    }
  }

  async signup(email: string, password: string) {
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
      console.error('Error during signup', error);
      throw error;
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
