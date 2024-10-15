import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IContactDetails } from '@dm/contact-details.model';
import { Observable } from 'rxjs';
import { IContactListItem } from '@dm/contact-list-item.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = environment.CONTACTS_SERVICE_ENDPOINT;

  constructor(private http: HttpClient) {}



  getContacts(): Observable<IContactListItem[]> {
    return this.http.get<IContactListItem[]>(`${this.apiUrl}/list`);
  }

  getContact(id : number): Observable<IContactDetails> {
    return this.http.get<IContactDetails>(`${this.apiUrl}/${id}`);
  }

  deleteContact(id : number) : Observable<IContactDetails[]> {
    return this.http.delete<IContactDetails[]>(`${this.apiUrl}/${id}`)
  }

  createContact(payload : IContactDetails){
    return this.http.put<IContactDetails>(`${this.apiUrl}` , payload)
  }

  updateContact(payload : IContactDetails){
    return this.http.patch<IContactDetails>(`${this.apiUrl}` , payload)
  }


}
