import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegisterModel } from '@dm/register.model';
import { UserRole } from '@dm/roleEnum.enum';
import { AuthService } from 'app/services/auth.service';
import { ageValidator } from 'app/utility/valiadators/age_validator';
import { passwordMatchValidator } from 'app/utility/valiadators/password_match_validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less',
})
export class RegisterComponent {

  errorMessage = '';

  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      repeatpassword: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required , ageValidator(16)]),
    },
    {
      validators: [passwordMatchValidator('password', 'repeatpassword')]
    },
  );


  constructor(private authService: AuthService, private router:Router) {}

  get email() {
    return this.registerForm.controls.email;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  get repeatpassword() {
    return this.registerForm.controls.repeatpassword;
  }

  get firstname() {
    return this.registerForm.controls.firstname;
  }

  get lastName() {
    return this.registerForm.controls.lastName;
  }

  get dateOfBirth() {
    return this.registerForm.controls.dateOfBirth;
  }

  onSubmit() {
    const registerForm = this.registerForm.value;

    const registerData: IRegisterModel = {
      name: registerForm.firstname || '',
      email: registerForm.email || '',
      password: registerForm.password || '',
      lastName: registerForm.lastName || '',
      dateOfBirth: registerForm.dateOfBirth
        ? new Date(registerForm.dateOfBirth)
        : new Date(),
      role: UserRole.User,
      active : true

    };

    this.authService.register(registerData).subscribe({
      next: (data) => {
        this.router.navigate(['/login']);
      },
      error: (errorResponse) => {
        console.error(errorResponse);
        this.errorMessage = errorResponse.error.message;
      },
    });
  }
}
