import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { ILoginModel } from '@dm/login.model';
import { IRegisterModel } from '@dm/register.model';
import { UserRole } from '@dm/roleEnum.enum';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubjectlogged = new BehaviorSubject<ILoginResponse | null>(null);
  user$ = this.userSubjectlogged.asObservable();

  private apiUrl = environment.GENERAL_SERVICE_ENDPOINT;

  constructor(private http: HttpClient) { }


  login(paylaod : ILoginModel): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, paylaod);
  }

  register(paylaod : IRegisterModel): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, paylaod);
  }


  setUser(user : ILoginResponse){
    this.userSubjectlogged.next(user)
  }

  unsetUser(){
    this.userSubjectlogged.next(null);
  }

  isLogged$(): Observable<boolean> {
    return this.user$.pipe(
      map(value => !!value)
    )
  }

  userRole$(): Observable<UserRole | undefined>{
    return this.user$.pipe(
      map(value => value?.role)
    )
  }

  userName$(): Observable<string | undefined>{
    return this.user$.pipe(
      map(value => value?.username)
    )
  }




}
