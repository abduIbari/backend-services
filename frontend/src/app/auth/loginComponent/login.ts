import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../auth-service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  private auth = inject(Auth);
  private router = inject(Router);

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    const userData: User = { user_email: email!, user_pwd: password! };

    this.auth.loginUser(userData).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        localStorage.setItem('token', res.token); // Save token
        this.router.navigate(['/todo']);
      },
      error: (err) => {
        switch (err.status) {
          case 400:
            const errors = err.error.errors;
            console.error('Validation errors:', errors);
            alert('Please fix validation errors in the form.');
            break;
          case 404:
            alert('User does not exist. Please register first.');
            this.router.navigate(['/register']);
            break;
          case 401:
            alert('Invalid password. Please try again.');
            break;
          case 500:
            alert('Server error occurred. Please try again later.');
            break;
          default:
            alert('An unknown error occurred.');
            console.error('Login error:', err);
        }
      },
    });
  }
}
