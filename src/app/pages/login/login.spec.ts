import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.services';
import { By } from '@angular/platform-browser';
import { UserCredential } from '@angular/fire/auth';

class MockAuthService {
  login(email: string, password: string): Promise<UserCredential> {
    if (email === 'test5@example.com' && password === 'test123') {
      return Promise.resolve({
        user: { uid: 'C2yG1DtA4fY3TQzfk2mxFmIKyt82', email },
        providerId: 'password',
        operationType: 'signIn'
      } as UserCredential);
    } else {
      return Promise.reject(new Error('Login failed'));
    }
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        LoginComponent,
        AuthFormComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render AuthFormComponent with formType set to "login"', () => {
    const authFormDebugElement = fixture.debugElement.query(By.directive(AuthFormComponent));
    const authFormComponentInstance = authFormDebugElement.componentInstance as AuthFormComponent;

    expect(authFormComponentInstance).toBeTruthy();
    expect(authFormComponentInstance.formType).toBe('login');
  });

  it('should navigate to dashboard on successful authentication', () => {
    spyOn(router, 'navigate');

    component.onAuthSuccess();

    expect(router.navigate).toHaveBeenCalledWith(['/pages/dashboard']);
  });

  it('should display the welcome message in the template', () => {
    const welcomeMessage = fixture.nativeElement.querySelector('h2.typing-text');
    expect(welcomeMessage.textContent).toContain('Welcome to TaskyMy');
  });

  it('should have a sign-up link that routes to the signup page', () => {
    const signUpLink = fixture.debugElement.query(By.css('a[routerLink="/pages/signup"]'));
    expect(signUpLink).toBeTruthy();
  });
});
