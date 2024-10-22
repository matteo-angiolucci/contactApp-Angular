import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IUser } from '@dm/user.mode';
import { UserService } from 'app/services/user.service';
import { passwordMatchValidator } from 'app/utility/valiadators/password_match_validator';


@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.less',
})
export class ChangePasswordModalComponent implements OnInit {
  @Input() user!: IUser;
  isOpen = false;

  @Output() closeModalE = new EventEmitter<void>();

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

  constructor(
    private userService: UserService) {}

  ngOnInit(): void {
    this.loadPassword();
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
     console.log(this.changePasswordForm.value);
      const currentPassword = this.currentPassword.value
      const newPassword  = this.newPassword.value
      if (currentPassword && newPassword && this.user) {
        this.userService
          .changePassword(this.user.id!, currentPassword, newPassword)
          .subscribe({
            next: (data) => {
              console.log(data);
            },
            error: (errorResponse) => {
              console.error(errorResponse);
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
    console.log("clciked on close button")
    this.closeModalE.emit();
  }



  loadPassword() {
    this.changePasswordForm.patchValue({
      currentPassword: this.user.id,
    });
  }

  // create a function inside to equalValues can be applied to any and it can check 2 distinctive values


  equalValues(controlName1 : string, controlName2 : string){
    return (control: AbstractControl) => {
      const val1 = control.get(controlName1)?.value;
      const val2 = control.get(controlName2)?.value

      if(val1 === val2){
        return null;
      }
      return { valuesNotEqual : true };
    }

  }
}
