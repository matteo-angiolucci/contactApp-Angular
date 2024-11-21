import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditCardFormatPipe } from 'app/utility/pipes/credit-card-format.pipe';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, CreditCardFormatPipe],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.less'
})
export class CreditCardComponent {
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardHolderName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern('^\\d{16}$')]],
      expMonth: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$')]],
      expYear: ['', [Validators.required, Validators.pattern('^\\d{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^\\d{3}$')]]
    });
  }

  get cardHolderName(){
    return this.paymentForm.get('cardHolderName');
  }

  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }


  get expMonth() {
    return this.paymentForm.get('expMonth');
  }


  get expYear() {
    return this.paymentForm.get('expYear');
  }

  get cvv() {
    return this.paymentForm.get('cvv');
  }
}
