import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '@dm/user.mode';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.USERS_SERVICE_ENDPOINT;

  // BehaviorSubject to hold whether the user is on the Admin Dashboard or not
  private isOnAdminDashboardSubject = new BehaviorSubject<boolean>(false);

  // Expose the subject as an observable
  isOnAdminDashboard$ = this.isOnAdminDashboardSubject.asObservable();


  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/list`);
  }


  updateUserStatus(loggedUser: IUser , user: IUser, status: boolean): Observable<IUser[]> {
    return this.http.patch<IUser[]>(`${this.apiUrl}/activeDeactive`, { loggedUser , user , active: status });
}
  // Method to update the subject when navigating to/from Admin Dashboard
  setAdminDashboardState(isOnAdminDashboard: boolean) {
    this.isOnAdminDashboardSubject.next(isOnAdminDashboard);
  }
}
