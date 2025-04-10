import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {
  @Input() formType: 'login' | 'signup' = 'login';
  @Output() authSuccess = new EventEmitter<void>();

  form: FormGroup | any = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.formType === 'signup') {
      this.form.addControl(
        'confirmPassword',
        this.fb.control('', [Validators.required, this.passwordMatchValidator.bind(this)])
      );
    }
  }


  get authError(): string | null {
    return this.authService.authError();
  }

  passwordMatchValidator(control: any): { [key: string]: boolean } | null {
    if (this.form && this.form.get('password')?.value !== control.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.form?.invalid) {
      this.authService.authError.set('Please fill out all fields correctly.');
      this.form.markAllAsTouched();
      return;
    }

    if (this.formType === 'signup' && this.form.value.password !== this.form.value.confirmPassword) {
      this.authService.authError.set('Passwords do not match.');
      return;
    }

    if (this.formType === 'signup') {
      await this.authService.signup(this.form.value.email, this.form.value.password);
    } else {
      await this.authService.login(this.form.value.email, this.form.value.password);
    }
    if (!this.authService.authError()) {
      this.authSuccess.emit(); // Emit event only if no error occurred
    }
  }
}
