import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupComponent } from './signup.component';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.services';
import { By } from '@angular/platform-browser';
import { UserCredential } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { signal } from '@angular/core';

class MockAuthService {
  authError = signal<string | null>(null); // Mocking authError as a signal

  signup(email: string, password: string): Promise<UserCredential> {
    if (email === 'test@example.com' && password === 'password123') {
      return Promise.resolve({
        user: new MockUser(),
        providerId: 'password',
        operationType: 'signIn'
      } as unknown as UserCredential);
    } else {
      this.authError.set('Signup failed'); // Set authError to simulate failure
      return Promise.reject(new Error('Signup failed'));
    }
  }
}

class MockUser implements User {
  uid = 'C2yG1DtA4fY3TQzfk2mxFmIKyt82';
  email = 'test@example.com';
  emailVerified = false;
  isAnonymous = false;
  metadata: any = {};
  providerData: any[] = [];
  refreshToken = '';
  tenantId = null;
  displayName = null;
  phoneNumber = null;
  photoURL = null;
  providerId = 'password';

  getIdToken(forceRefresh?: boolean): Promise<string> {
    return Promise.resolve('fake-token');
  }
  getIdTokenResult(forceRefresh?: boolean): Promise<any> {
    return Promise.resolve({ token: 'fake-token' });
  }
  reload(): Promise<void> {
    return Promise.resolve();
  }
  delete(): Promise<void> {
    return Promise.resolve();
  }
  toJSON(): object {
    return {};
  }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule, // Added to handle HttpClient dependency
        SignupComponent,         // Standalone component
        AuthFormComponent        // Standalone component
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as MockAuthService;
    fixture.detectChanges();
  });

  it('should create the SignupComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render AuthFormComponent with formType set to "signup"', () => {
    const authFormDebugElement = fixture.debugElement.query(By.directive(AuthFormComponent));
    const authFormComponentInstance = authFormDebugElement.componentInstance as AuthFormComponent;

    expect(authFormComponentInstance).toBeTruthy();
    expect(authFormComponentInstance.formType).toBe('signup');
  });

  it('should navigate to dashboard on successful signup', async () => {
    spyOn(router, 'navigate');

    await component.onSignupSuccess();

    expect(router.navigate).toHaveBeenCalledWith(['/pages/dashboard']);
  });

  it('should display the welcome message in the template', () => {
    const welcomeMessage = fixture.nativeElement.querySelector('h2.welcome');
    expect(welcomeMessage.textContent).toContain('Create TaskyMy account');
  });

  it('should have a login link that routes to the login page', () => {
    const loginLink = fixture.debugElement.query(By.css('a[routerLink="/pages/login"]'));
    expect(loginLink).toBeTruthy();
  });

  it('should handle signup failure', async () => {
    try {
      await authService.signup('wrong@example.com', 'wrongpassword');
    } catch (e) {
      expect(authService.authError()).toBe('Signup failed');
    }
  });
});
