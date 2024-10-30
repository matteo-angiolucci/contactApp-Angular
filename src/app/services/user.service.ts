import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { passwordChangeApiReturn } from '@dm/passwordChange-API.model';
import { IUser } from '@dm/user.model';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.USERS_SERVICE_ENDPOINT;

  private isOnAdminDashboardSubject = new BehaviorSubject<boolean>(false);
  isOnAdminDashboard$ = this.isOnAdminDashboardSubject.asObservable();

  private openPasswordChangeModalSubject = new BehaviorSubject<boolean>(false);
  openPasswordChangeModal$ = this.openPasswordChangeModalSubject.asObservable();

  private currentSelectedUserSubeject = new BehaviorSubject<IUser | null>(null);
  currentUserSelected$ = this.currentSelectedUserSubeject.asObservable();

  private userListSubject = new BehaviorSubject<IUser[]>([]);
  userList$ = this.userListSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/list`);
  }

  updateUserStatus(
    loggedUser: IUser,
    user: IUser,
    status: boolean,
  ): Observable<IUser[]> {
    return this.http.patch<IUser[]>(`${this.apiUrl}/activeDeactive`, {
      loggedUser,
      user,
      active: status,
    });
  }

  changePassword(
    loggedUser: IUser,
    user: IUser,
    newPassword: string,
  ): Observable<passwordChangeApiReturn> {
    return this.http.patch<passwordChangeApiReturn>(
      `${this.apiUrl}/changePassword`,
      { user, loggedUser, newPassword },
    );
  }

  // Method to update the subject state
  setAdminDashboardState(isOnAdminDashboard: boolean) {
    this.isOnAdminDashboardSubject.next(isOnAdminDashboard);
  }

  // Method to get the current state (optional, for synchronous checks)
  getAdminDashboardState(): boolean {
    return this.isOnAdminDashboardSubject.value;
  }

  // Method to update the subject when navigating to/from Admin Dashboard
  setCurrentUser(currentUser: IUser | null) {
    this.currentSelectedUserSubeject.next(currentUser);
  }

  // Method to update the subject of the open password modal
  openPasswordModal(isPasswordModalOpen: boolean) {
    this.openPasswordChangeModalSubject.next(isPasswordModalOpen);
  }

  loadUsers() {
    this.getUsers().subscribe((users) => {
      this.userListSubject.next(users);
    });
  }
}
