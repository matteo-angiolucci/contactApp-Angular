import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordChangeApiReturn } from '@dm/passwordChange-API.model';
import { IUser } from '@dm/user.model';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { passwordMatchValidator } from 'app/utility/valiadators/password_match_validator';
import { combineLatest, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.less',
})
export class ChangePasswordModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  loggedUser: IUser | null = null;
  currentUserSelected: IUser | null = null;
  private destroy$ = new Subject<void>();

  @Output() closeModalE = new EventEmitter<void>();
  outputMessage = '';

  changePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl({ value: '', disabled: true }),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    {
      validators: [passwordMatchValidator('newPassword', 'confirmPassword')],
    },
  );

  constructor(private userService: UserService, private authService: AuthService) {
  }

  ngOnInit(): void {
    combineLatest([this.authService.userLogged$ , this.userService.getUsers(), this.userService.currentUserSelected$])
    .pipe(takeUntil(this.destroy$)) // Add takeUntil here
    .subscribe({
      next: ([userLogged , users, currentUserSelected]) => {
        console.log("EMISSIONS ON PASSWORD CHANGE COMPONENT:", userLogged , users, currentUserSelected);
        this.loggedUser = userLogged;
        this.currentUserSelected = currentUserSelected;
        this.loadPassword();
      },
    });
  }


  onSubmit() {
    if (this.changePasswordForm.valid) {
      const currentPassword = this.currentPassword.value;
      const newPassword = this.newPassword.value;
      if (currentPassword && newPassword && this.loggedUser && this.currentUserSelected) {
        this.userService
          .changePassword(this.loggedUser, this.currentUserSelected, newPassword)
          .subscribe({
            next: (data : passwordChangeApiReturn) => {
              this.outputMessage = data.outputmessage;
              this.userService.updateUserSubjectList(data.user);
              this.onClose();
            },
            error: (errorResponse) => {
              console.error(errorResponse);
              this.outputMessage = errorResponse.error.outputmessage;
            },
          });
      }
    }
  }

  get currentPassword() {
    return this.changePasswordForm.controls.currentPassword;
  }

  // Getter for newPassword
  get newPassword() {
    return this.changePasswordForm.controls.newPassword;
  }

  // Getter for confirmPassword
  get confirmPassword() {
    return this.changePasswordForm.controls.confirmPassword;
  }

  onClose() {
    this.closeModalE.emit();
  }

  loadPassword() {
    this.changePasswordForm.patchValue({
      currentPassword: this.currentUserSelected?.password,
    });
  }

  // create a function inside to equalValues can be applied to any and it can check 2 distinctive values

  equalValues(controlName1: string, controlName2: string) {
    return (control: AbstractControl) => {
      const val1 = control.get(controlName1)?.value;
      const val2 = control.get(controlName2)?.value;

      if (val1 === val2) {
        return null;
      }
      return { valuesNotEqual: true };
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
