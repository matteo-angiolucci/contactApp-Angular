import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IContactDetails } from '@dm/contact-details.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IContactListItem } from '@dm/contact-list-item.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {

  private setSelectedContactSubject = new BehaviorSubject<IContactDetails | undefined>(undefined);
  // Observable for the selected card object
  selectedContact$ = this.setSelectedContactSubject.asObservable();

  private isFormCreateOrEditOpenSubject = new BehaviorSubject<boolean>(false);
  // Observable for the selected card object
  isFormOpen$ = this.isFormCreateOrEditOpenSubject.asObservable();

  private selectedLetterSubject = new BehaviorSubject<string>('');
  // Observable for the selected letter
  selectedLetter$ = this.selectedLetterSubject.asObservable();

  private contactsSubject = new BehaviorSubject<IContactListItem[]>([]);
  // Observable for the contacts
  contacts$ = this.contactsSubject.asObservable();


  private apiUrl = environment.CONTACTS_SERVICE_ENDPOINT;


    // Internal storage for contacts (usually fetched from a server)
    private contacts: IContactListItem[] = [];

  constructor(private http: HttpClient) {
    this.loadContacts();
  }



  getContacts(): Observable<IContactListItem[]> {
    return this.http.get<IContactListItem[]>(`${this.apiUrl}/list`);
  }

  getContact(id : number): Observable<IContactDetails> {
    return this.http.get<IContactDetails>(`${this.apiUrl}/${id}`);
  }

  deleteContact(id : number) : Observable<IContactDetails[]> {
    return this.http.delete<IContactDetails[]>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadContacts())
    )
  }

  createContact(payload : IContactDetails){
    return this.http.put<IContactDetails>(`${this.apiUrl}` , payload).pipe(
      tap(() => this.loadContacts())
    )
  }

  updateContact(payload : IContactDetails){
    return this.http.patch<IContactDetails>(`${this.apiUrl}` , payload).pipe(
      tap(() => this.loadContacts()))
  }

    setSelectedContact(contact: IContactDetails | undefined): void {
      this.setSelectedContactSubject.next(contact);
    }

    setVisibilityForms(isOpen :boolean): void {
      this.isFormCreateOrEditOpenSubject.next(isOpen);
    }

    setSelectedLetter(letter: string) {
      if (this.selectedLetterSubject.value === letter) {
        this.selectedLetterSubject.next('');
      } else {
        this.selectedLetterSubject.next(letter);
      }
    }

    addContactSubject(createdContact : IContactListItem){
      this.contacts.push(createdContact);
      this.contactsSubject.next(this.contacts); // Emit the updated contacts
    }

    updateContactSubject(updatedContact : IContactListItem) {

      const index = this.contacts.findIndex(contact => contact.id === updatedContact.id);
      if (index > -1) {
        this.contacts[index] = updatedContact;
        this.contactsSubject.next(this.contacts); // Emit the updated contacts
      }
    };

    deleteContactSubject(contactD : number) {

      this.contacts = this.contacts.filter(contact => contact.id !== contactD);
      this.contactsSubject.next(this.contacts);
    };

    loadContacts() {
      this.getContacts().subscribe(contacts => {
        this.contactsSubject.next(contacts);
      });
    }
  }
