import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { ILoginModel } from '@dm/login.model';
import { IRegisterModel } from '@dm/register.model';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserRole } from '@dm/roles';
import { IUser } from '@dm/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubjectlogged = new BehaviorSubject<ILoginResponse | null>(null);
  userLogged$ = this.userSubjectlogged.asObservable();

  private apiUrl = environment.GENERAL_SERVICE_ENDPOINT;


  // try tp use a signal to store the logged user Role

  userRoleSignal = signal<UserRole>('User');

  constructor(private http: HttpClient) {
   }


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
    return this.userLogged$.pipe(
      map(value => !!value)
    )
  }

  userRole$(): Observable<UserRole | undefined>{
    return this.userLogged$.pipe(
      map(value => value?.role)
    )
  }

  userName$(): Observable<string | undefined>{
    return this.userLogged$.pipe(
      map(value => value?.name)
    )
  }

    // Function use to set the signal
    setUserRole(role: UserRole) {
      this.userRoleSignal.set(role);
    }

    getCurrentUser(): IUser | null {
      return this.userSubjectlogged.getValue();
    }





}
