import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContactListItem } from '@dm/contact-list-item.model';
import { ContactService } from 'app/services/contact.service';
import { ContactItemComponent } from "../contact-item/contact-item.component";
import { Router } from '@angular/router';

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

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private contactSrc : ContactService,
              private router : Router
  ){

  }

  ngOnInit(){
    this.contactSrc.getContacts().subscribe({
      next: (data: IContactListItem[]) => {
        this.contacts = data;
        this.filteredContacts = data;
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
