import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IContactDetails } from '@dm/contact-details.model';
import { IContactListItem } from '@dm/contact-list-item.model';
import { ContactService } from 'app/services/contact.service';
import { AuthDirective } from 'app/utility/directives/auth.directive';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-item',
  standalone: true,
  imports: [RouterLink, CommonModule, AuthDirective],
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.less',
})
export class ContactItemComponent{
  @Input() contact!: IContactListItem;
  isFormOpen$: Observable<boolean>;
  selectedContact$ : Observable<IContactDetails | undefined>;

  constructor(private contactService: ContactService) {
    this.isFormOpen$ = this.contactService.isFormOpen$;
    this.selectedContact$ = this.contactService.selectedContact$;
  }

  openEditForm(contact: IContactDetails) {
    this.contactService.setSelectedContact(contact);
    this.contactService.setVisibilityForms(true);
  }

  deleteContact() {
    this.contactService.deleteContact(this.contact.id).subscribe(() => {
      console.log('contact deleated');
    });
  }
}
