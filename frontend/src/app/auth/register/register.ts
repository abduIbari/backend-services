import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '../auth-service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// Custom validator function to check if password and confirmPassword match
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  private auth = inject(Auth);
  private router = inject(Router);

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { email, password, confirmPassword } = this.registerForm.value;

    const userData: User = { user_email: email!, user_pwd: password! };

    this.auth.registerUser(userData).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        switch (err.status) {
          case 400:
            const errors = err.error.errors;
            console.error('Validation errors:', errors);
            alert('Please fix validation errors in the form.');
            break;
          case 409:
            alert('User already exists with this email. Try logging in.');
            this.router.navigate(['/login']);
            break;
          case 500:
            alert('Server error occurred. Please try again later.');
            break;
          default:
            alert('An unknown error occurred.');
            console.error('Registration error:', err);
        }
      },
    });
  }
}
