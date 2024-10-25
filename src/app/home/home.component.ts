import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContactListItem } from '@dm/contact-list-item.model';
import { ContactService } from 'app/services/contact.service';
import { ContactItemComponent } from "../contact-item/contact-item.component";
import { CategoryService } from 'app/services/category.service';
import { combineLatest, map, Observable, of } from 'rxjs';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { AuthService } from 'app/services/auth.service';
import { ContactDetailComponent } from "../contact-detail/contact-detail.component";
import { IContactDetails } from '@dm/contact-details.model';
import { ICategory } from '@dm/category.model';
import { AuthDirective } from 'app/utility/directives/auth.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContactItemComponent, ContactDetailComponent, AuthDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
})
export class HomeComponent implements OnInit {
  user$: Observable<ILoginResponse | null>;
  selectedContact$: Observable<IContactDetails | undefined>;
  isOpenForm$: Observable<boolean>;
  filteredContacts$: Observable<IContactListItem[]> = of([]);
  categories$: Observable<ICategory[]>;

  selectedLetter$: Observable<string>;

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private contactService: ContactService,
  ) {
    this.user$ = this.authService.user$;
    this.selectedContact$ = this.contactService.selectedContact$;
    this.isOpenForm$ = this.contactService.isFormOpen$;
    this.selectedLetter$ = this.contactService.selectedLetter$;
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit() {
    this.filteredContacts$ = combineLatest([
      this.contactService.contacts$,
      this.categories$,
      this.selectedLetter$,
      this.categoryService.selectedCategory$
    ]).pipe(
      // Combine contacts and categories to add category names
      map(([contacts, categories, selectedLetter, selectedCategory]) => {
        let combinedContacts = contacts.map((contact) => {
          const category = categories.find(
            (cat) => cat.id === contact.categoryId,
          );
          return {
            ...contact,
            categoryName: category ? category.name : 'Unknown',
          };
        });

        // Filter based on selected letter, if provided
        if (selectedLetter) {
          combinedContacts = combinedContacts.filter((contact) =>
            contact.alias.startsWith(selectedLetter),
          );
        }

        // Filter based on selected category, if provided
        if (selectedCategory) {
          combinedContacts = combinedContacts.filter(
            (contact) => contact.categoryId === selectedCategory,
          );
        }

        return combinedContacts;
      }),
    );
  }

  addNewContact() {
    const contactNew: IContactDetails = {
      alias: '',
      email: '',
      lastName: '',
      firstName: '',
      birthDate: undefined,
      phoneNo: '',
      categoryId: 0,
      id: -1,
    };
    this.contactService.setSelectedContact(contactNew);
    this.contactService.setVisibilityForms(true);
  }

  setSelectedLetter(letter: string) {
    this.contactService.setSelectedLetter(letter);
  }

  onCategoryChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const categoryId = selectedValue ? Number(selectedValue) : null;
    this.categoryService.setSelectedCategory(categoryId);
  }
}
