import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { ILoginModel } from '@dm/login.model';
import { AuthService } from 'app/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  errorMessage = '';
  isEmailNotRegistered = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private authService: AuthService,
    private route: Router,
  ) {}

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;

      const loginForm: ILoginModel = {
        email: formValues.email || '',
        password: formValues.password || '',
      };

      this.authService.login(loginForm).subscribe({
        next: (response: ILoginResponse) => {

          localStorage.setItem('currentUser', JSON.stringify({ ...response}));
          this.authService.setUser(response);
          this.route.navigate(['/home']);
        },
        error: (errorResponse) => {
          // Check for the specific error about email not registered
          if (
            errorResponse.error.message ===
            'User not found with the email provided'
          ) {
            this.errorMessage = 'Email not registered. Click here to register.';
            this.isEmailNotRegistered = true;
          } else {
            this.errorMessage = errorResponse.error.message;
            this.isEmailNotRegistered = false;
          }
         }
        });
    }
  }

  handleClick(): void {
    if (this.isEmailNotRegistered) {
      this.route.navigate(['/register']);
    }
  }
}
