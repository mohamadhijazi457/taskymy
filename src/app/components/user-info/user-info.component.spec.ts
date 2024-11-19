import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { AuthService } from '../../services/auth.services';
import { signal } from '@angular/core';

class MockAuthService {
  // Mocking method to get user email from token
  getUserEmailFromToken(): string | null {
    return 'test@example.com';
  }
}

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as MockAuthService;
    fixture.detectChanges();
  });

  it('should create the UserInfoComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have default avatar set to "./assets/man.jpg"', () => {
    expect(component.avatar()).toBe('./assets/man.jpg');
  });

  it('should have default isAvatarSelectionVisible set to false', () => {
    expect(component.isAvatarSelectionVisible()).toBeFalse();
  });

  it('should set userEmail correctly on initialization', () => {
    component.ngOnInit();
    expect(component.userEmail()).toBe('test@example.com');
  });

  it('should toggle isAvatarSelectionVisible when toggleAvatarSelection is called', () => {
    expect(component.isAvatarSelectionVisible()).toBeFalse();

    component.toggleAvatarSelection();
    expect(component.isAvatarSelectionVisible()).toBeTrue();

    component.toggleAvatarSelection();
    expect(component.isAvatarSelectionVisible()).toBeFalse();
  });

  it('should update avatar and hide avatar selection when selectAvatar is called', () => {
    component.isAvatarSelectionVisible.set(true);
  
    const newAvatar = './assets/new-avatar.jpg';
    component.selectAvatar(newAvatar);
  
    expect(component.avatar()).toBe(newAvatar);
  
    expect(component.isAvatarSelectionVisible()).toBeFalse();
  });
  
});
