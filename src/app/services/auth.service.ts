import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { ILoginModel } from '@dm/login.model';
import { IRegisterModel } from '@dm/register.model';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { UserRole } from '@dm/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubjectlogged = new BehaviorSubject<ILoginResponse | null>(null);
  user$ = this.userSubjectlogged.asObservable();

  private apiUrl = environment.GENERAL_SERVICE_ENDPOINT;

  constructor(private http: HttpClient, private localStorageService : LocalStorageService) {
    //this.loadUserFromLocalStorage();
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
      map(value => value?.name)
    )
  }


  // AuthService
// isLoggedInLocalStorageInfo(): boolean {
//   const user = JSON.parse(this.localStorageService.getItem('currentUser')!);
//   if (user) {
//     return true;
//   } else {
//     this.localStorageService.removeItem('currentUser');
//     return false;
//   }
// }

  // Populate the subject with user data from localStorage (on service initialization)
  // private loadUserFromLocalStorage(): void {
  //   const user = JSON.parse(this.localStorageService.getItem('currentUser')!);
  //   if (user) {
  //     this.userSubjectlogged.next(user);  // Set BehaviorSubject with stored user
  //   }
  // }




}
