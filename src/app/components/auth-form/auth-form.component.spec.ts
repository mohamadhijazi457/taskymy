import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthFormComponent } from './auth-form.component';
import { AuthService } from '../../services/auth.services';
import { signal } from '@angular/core';

class MockAuthService {
  signup(email: string, password: string) {
    return Promise.resolve({});
  }
  login(email: string, password: string) {
    return Promise.resolve({});
  }
  checkAuthentication() {
    return true;
  }

  // Mocking the authError as a signal
  authError = signal<string | null>(null);
}

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AuthFormComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as MockAuthService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with email and password controls', () => {
    expect(component.form.contains('email')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
  });

  it('should make the email control required and validate email format', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should make the password control required and validate minimum length', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalsy();

    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBeFalsy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should add confirmPassword control for signup form type', () => {
    component.formType = 'signup';
    component.ngOnInit();
    expect(component.form.contains('confirmPassword')).toBeTruthy();
  });

  it('should display error message if form is invalid on submit', () => {
    component.onSubmit();
    expect(component.authError).toBe('Please fill out all fields correctly.');
  });

  it('should call signup method for signup form type on valid submit', async () => {
    spyOn(authService, 'signup').and.callThrough();
    component.formType = 'signup';
    component.ngOnInit();
    component.form.setValue({ email: 'user123@example.com', password: '123456', confirmPassword: '123456' });

    await component.onSubmit();

    expect(authService.signup).toHaveBeenCalledWith('user123@example.com', '123456');
  });
});
