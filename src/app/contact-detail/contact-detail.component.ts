import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { IContactDetails } from '@dm/contact-details.model';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { AuthService } from 'app/services/auth.service';
import { CategoryService } from 'app/services/category.service';
import { ContactService } from 'app/services/contact.service';
import { AuthDirective } from 'app/utility/directives/auth.directive';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AuthDirective],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.less',
})
export class ContactDetailComponent implements OnInit, OnDestroy {

  user$: Observable<ILoginResponse | null>;
  selectedContact$: Observable<IContactDetails | undefined>;
  private destroy$ = new Subject<void>();
  isEditing = false;

  initialData!: IContactDetails;

  contactId: number | null = null;

  //userRoleEnum = UserRole;

  isLoading = false;

  contactForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.email]),
    phoneNo: new FormControl('', [
      Validators.required,
      this.phoneFormatValidator,
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    alias: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', Validators.required),
  });

  constructor(
    private contactService: ContactService,
    public categoriesService: CategoryService,
    private authService: AuthService,
  ) {
    this.user$ = this.authService.user$;
    this.selectedContact$ = this.contactService.selectedContact$;
  }

  ngOnInit(): void {
    this.contactService.selectedContact$
      .pipe(takeUntil(this.destroy$))
      .subscribe((contact) => {
        if (contact?.id !== undefined && contact.id !== -1) {
          this.contactId = contact.id;
          this.loadContact(this.contactId);
        }
      });

      // Subscribe to form value changes to listen to those changes
  //   this.contactForm.valueChanges.subscribe((formValues) => {
  //     console.log(formValues);
  //   });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //valditore numero telefono XXX-XXXXX
  phoneFormatValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[0-9]{3}-[0-9]{6}$/;
    const valid = regex.test(control.value);
    return valid ? null : { phoneFormat: true };
  }

  onSubmit() {
    if (!this.contactForm.invalid) {
      const formValues = this.contactForm.value;

      const contactData: IContactDetails = {
        firstName: formValues.firstName || '',
        lastName: formValues.lastName || '',
        email: formValues.email || '',
        phoneNo: formValues.phoneNo || '',
        alias: formValues.alias || '',
        id: this.contactId || undefined,
        categoryId: Number(formValues.categoryId) || 1,
      };
      if (this.isEditing === false) {
        this.contactService.createContact(contactData).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error('Error submitting form:', error);
          },
        );
      } else {
        this.contactService.updateContact(contactData).subscribe(
          () => {
            this.isEditing = false;
            //this.contactService.updateContact(contactData);
          },
          (error) => {
            console.error('Error Updating form:', error);
          },
        );
      }
    }
  }

  loadContact(contactId: number): void {
    this.contactService
      .getContact(contactId)
      .subscribe((contact: IContactDetails) => {
        this.contactForm.patchValue({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phoneNo: contact.phoneNo,
          alias: contact.alias,
          categoryId: contact.categoryId.toString(),
        });
        this.initialData = contact;
        this.isLoading = false;
        this.isEditing = true;
      });
  }

  resetValues() {
    if(this.isEditing){
      this.contactForm.patchValue({
        firstName: this.initialData.firstName,
        lastName: this.initialData.lastName,
        email: this.initialData.email,
        phoneNo: this.initialData.phoneNo,
        alias: this.initialData.alias,
        categoryId: this.initialData.categoryId.toString(),
      });
    } else{
      this.contactForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        alias: '',
        categoryId: '',
      });
    }
  }

  closePopUp() {
    this.contactService.setSelectedContact(undefined);
    this.contactService.setVisibilityForms(false);
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get email() {
    return this.contactForm.controls.email;
  }

  get alias() {
    return this.contactForm.controls.alias;
  }

  get lastName() {
    return this.contactForm.controls.lastName;
  }

  get phoneNo() {
    return this.contactForm.controls.phoneNo;
  }

  get category() {
    return this.contactForm.controls.categoryId;
  }
}
