import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateOfBirth = control.value;

    if (!dateOfBirth) {
      return null;  // If there's no value, don't apply validation
    }

    const dob = new Date(dateOfBirth);

    const today = new Date();

    const age = today.getFullYear() - dob.getFullYear();


    return age >= minAge ? null : { underage: true };
  };
}
