import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { IContactDetails } from '@dm/contact-details.model';
import { CategoryService } from 'app/services/category.service';
import { ContactService } from 'app/services/contact.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.less',
})
export class ContactDetailComponent implements OnInit {
  isEditing = false;

  initialData!: IContactDetails;

  contactId: number | null = null;

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
    categoryId : new FormControl('', Validators.required),
    id: new FormControl(),
  });

  constructor(
    private contactSrv: ContactService,
    private router: ActivatedRoute,
    private route: Router,
    public categoriesService : CategoryService
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {
      this.contactId = params['id'] ? params['id'] : null;
      if (this.contactId) {
        this.loadContact(this.contactId);
        this.disableForm();
      }
    });
  }

  //valditore numero telefono XXX-XXXXX
  phoneFormatValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[0-9]{3}-[0-9]{6}$/;
    const valid = regex.test(control.value);
    return valid ? null : { phoneFormat: true };
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formValues = this.contactForm.value;

      const contactData: IContactDetails = {
        firstName: formValues.firstName || '',
        lastName: formValues.lastName || '',
        email: formValues.email || '',
        phoneNo: formValues.phoneNo || '',
        alias: formValues.alias || '',
        id : this.contactId || undefined,
        categoryId : Number(formValues.categoryId) || 1
      };
      if (!this.isEditing) {
        this.contactSrv.createContact(contactData).subscribe(
          (response) => {
            this.route.navigate([], {
              queryParams: { id: response.id },
              queryParamsHandling: 'merge',
            });
            this.disableForm();
            this.isEditing = false;
          },
          (error) => {
            console.error('Error submitting form:', error);
          },
        );
      } else {
        this.contactSrv.updateContact(contactData).subscribe(
          () => {
            this.disableForm();
            this.isEditing = false;
          },
          (error) => {
            console.error('Error Updating form:', error);
            this.disableForm();

          },
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }

  loadContact(id: number): void {
    this.contactSrv.getContact(id).subscribe((contact: IContactDetails) => {
      this.contactForm.patchValue({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phoneNo: contact.phoneNo,
        alias: contact.alias,
        categoryId: contact.categoryId.toString()
      });
      this.isEditing = false;
      this.initialData = contact;
    });
  }

  deleteContact(): void {
    if (this.contactId) {
      this.contactSrv.deleteContact(this.contactId).subscribe(() => {
        this.route.navigate(['/home']);
      });
    }
  }

  private disableForm(): void {
    this.contactForm.disable();
  }

  enableForm(): void {
    this.contactForm.enable();
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.contactForm.patchValue({
      firstName: this.initialData.firstName,
      lastName: this.initialData.lastName,
      email: this.initialData.email,
      phoneNo: this.initialData.phoneNo,
      alias: this.initialData.alias,
      categoryId: this.initialData.categoryId.toString()
    });
    this.disableForm();
    this.isEditing = false;
  }

  goBackToHome() {
    this.route.navigate(['/home']);
  }

  get firstName(){
    return this.contactForm.controls.firstName;
  }

  get email(){
    return this.contactForm.controls.email;
  }

  get alias(){
    return this.contactForm.controls.alias;
  }

  get lastName(){
    return this.contactForm.controls.lastName;
  }

  get phoneNo(){
    return this.contactForm.controls.phoneNo;
  }

  get category(){
    return this.contactForm.controls.categoryId;
  }

}
