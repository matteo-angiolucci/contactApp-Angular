import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardFormat',
  standalone: true
})
export class CreditCardFormatPipe implements PipeTransform {
  transform(value: any): string {
    const stringValue = String(value); // Cast the value to a string
    const sanitizedValue = stringValue.replace(/\D/g, ''); // Remove all non-digit characters
    return sanitizedValue.replace(/(\d{4})(?=\d)/g, '$1 '); // Add a space every 4 digits
  }
}
