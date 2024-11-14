import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.services';
import { getAuth,User } from 'firebase/auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    localStorage.removeItem('authToken');
  });

  afterEach(() => {
    service.authToken.set(null);
    service.isAuthenticated.set(false);
  });

  it('should set authToken and isAuthenticated signals on successful login', async () => {
    const mockUser = { getIdToken: () => Promise.resolve('test-token') } as User;
    spyOn(service as any, '_signInWithEmailAndPassword').and.returnValue(Promise.resolve({ user: mockUser }));

    await service.login('test@example.com', 'password123');

    expect(service.authToken()).toBe('test-token');
    expect(service.isAuthenticated()).toBeTrue();
    expect(localStorage.getItem('authToken')).toBe('test-token');
  });

  it('should throw an error and not update signals on failed login', async () => {
    spyOn(service as any, '_signInWithEmailAndPassword').and.returnValue(Promise.reject('Login error'));

    await expectAsync(service.login('invalid@example.com', 'wrongpassword'))
      .toBeRejectedWith('Login error');

    expect(service.authToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should set authToken and isAuthenticated signals on successful signup', async () => {
    const mockUser = { getIdToken: () => Promise.resolve('test-token') } as User;
    spyOn(service as any, '_createUserWithEmailAndPassword').and.returnValue(Promise.resolve({ user: mockUser }));

    await service.signup('newuser@example.com', 'newpassword');

    expect(service.authToken()).toBe('test-token');
    expect(service.isAuthenticated()).toBeTrue();
    expect(localStorage.getItem('authToken')).toBe('test-token');
  });

  it('should throw an error and not update signals on failed signup', async () => {
    spyOn(service as any, '_createUserWithEmailAndPassword').and.returnValue(Promise.reject('Signup error'));

    await expectAsync(service.signup('invalid@example.com', 'short'))
      .toBeRejectedWith('Signup error');

    expect(service.authToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should clear authToken and set isAuthenticated to false on logout', async () => {
    spyOn(service as any, '_signOut').and.returnValue(Promise.resolve());

    service.authToken.set('test-token');
    service.isAuthenticated.set(true);

    await service.logout();

    expect(service.authToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should return the correct authToken from signal', () => {
    service.authToken.set('test-token');
    expect(service.getAuthTokenFromSignal()).toBe('test-token');

    service.authToken.set(null);
    expect(service.getAuthTokenFromSignal()).toBeNull();
  });

  it('should return the correct authentication state', () => {
    service.isAuthenticated.set(true);
    expect(service.checkAuthentication()).toBeTrue();

    service.isAuthenticated.set(false);
    expect(service.checkAuthentication()).toBeFalse();
  });
});
