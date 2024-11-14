import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/google-config';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {

googleAuthToken = signal<string | null>(null);

constructor() {
    const storedGoogleToken = localStorage.getItem('googleAuthToken');
    if (storedGoogleToken) {
      this.googleAuthToken.set(storedGoogleToken);
    }
}

// Initiating Google OAuth flow
initiateGoogleOAuth() {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${environment.googleClientId}&redirect_uri=${environment.redirectUri}&response_type=token&scope=https://www.googleapis.com/auth/tasks`;
    window.location.href = authUrl; // Redirecting to Google OAuth
}

// Handling OAuth redirect response and extract token
handleOAuthRedirectResponse(urlHash: string) {
    const params = new URLSearchParams(urlHash.replace('#', ''));
    const googleToken = params.get('access_token');
    if (googleToken) {
      this.googleAuthToken.set(googleToken);
      localStorage.setItem('googleAuthToken', googleToken);
    }
}

// Retrieving the Google Auth Token
getGoogleAuthToken(): string | null {
    return this.googleAuthToken();
}
}
