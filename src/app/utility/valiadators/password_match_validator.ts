import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password2 = formGroup.get(password);
    const password1 = formGroup.get(confirmPassword);

    if (!password2 || !password1) {
      return null;
    }

    const passwordsMatch = password2.value === password1.value;

    // If passwords do not match, return an error object
    if (!passwordsMatch) {
      password1.setErrors({ passwordMismatch: true });
    } else {
      // If passwords match, clear any existing errors
      password1.setErrors(null);
    }

    return null;
  };
}
