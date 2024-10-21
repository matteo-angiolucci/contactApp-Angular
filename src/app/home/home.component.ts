import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContactListItem } from '@dm/contact-list-item.model';
import { ContactService } from 'app/services/contact.service';
import { ContactItemComponent } from "../contact-item/contact-item.component";
import { Router } from '@angular/router';
import { CategoryService } from 'app/services/category.service';
import { combineLatest, map, Observable } from 'rxjs';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { AuthService } from 'app/services/auth.service';
import { UserRole } from '@dm/roleEnum.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, ContactItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
})
export class HomeComponent implements OnInit {

  contacts: IContactListItem[] = [];
  filteredContacts: IContactListItem[] = [];
  selectedLetter: string | null = null;

  user$: Observable<ILoginResponse | null>;

  userRoles = UserRole;

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private contactSrc : ContactService,
              private router : Router,
              private categorySrc : CategoryService,
              private authService: AuthService

  ){
    this.user$ = this.authService.user$;
  }

  ngOnInit(){

    combineLatest([
      this.contactSrc.getContacts(),
      this.categorySrc.getCategories()
    ]).pipe(
      map(([contacts, categories]) => {
        // Map over contacts and find corresponding category name
        return contacts.map(contact => {
          const category = categories.find(cat => cat.id === contact.categoryId);
          return {
            ...contact,
            categoryName: category ? category.name : 'Unknown'
          };
        });
      })
    ).subscribe({
      next: (combinedData) => {
        this.contacts = combinedData;
        this.filteredContacts = combinedData;
      }
    });
  }


  filterByLetter(letter: string): void {
    if (this.selectedLetter && letter === this.selectedLetter) {
      this.filteredContacts = this.contacts;
      this.selectedLetter = null;
    } else {
      this.selectedLetter = letter;
      this.filteredContacts = this.contacts.filter((contact) =>
        contact.alias.toUpperCase().startsWith(letter)
    );
  }
}
  addNewContact() {
  this.router.navigate(['/contact-details'])
  }
}
