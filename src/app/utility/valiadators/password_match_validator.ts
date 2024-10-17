import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const passwordsMatch = passwordControl.value === confirmPasswordControl.value;

    // If passwords do not match, return an error object
    if (!passwordsMatch) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      // If passwords match, clear any existing errors
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}
