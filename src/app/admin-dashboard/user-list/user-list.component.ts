import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '@dm/user.mode';
import { AuthService } from 'app/services/auth.service';
import { LocalStorageService } from 'app/services/local-storage.service';
import { UserService } from 'app/services/user.service';
import { combineLatest } from 'rxjs';
import { ChangePasswordModalComponent } from "../change-password-modal/change-password-modal.component";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ChangePasswordModalComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.less',
})
export class UserListComponent implements OnInit, OnDestroy {
  users: IUser[] = [];

  isModalOpen = false;
  currentSelectedUser : IUser = {};

  constructor(
    private userSerivce: UserService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.userSerivce.setAdminDashboardState(true);
    combineLatest([this.authService.user$ , this.userSerivce.getUsers()])
    .subscribe({
      next: ([currentUser , data]) => {
        this.users = data.filter((user) => user.email !== currentUser?.email); // Filter out the current user
      },
    });
  }

  onToggleUserStatus(user: IUser, newStatus: boolean) {
    const currentuserString = this.localStorageService.getItem('currentUser');
    const currentUser: IUser = currentuserString
    ? JSON.parse(currentuserString)
    : null;
    if (currentUser) {
      this.userSerivce
      .updateUserStatus(currentUser, user, newStatus)
      .subscribe({
        next: (response) => {
          this.users = response;
        },
        error: (err) => {
            console.error('Error updating user status:', err);
          },
        });
    }
  }

  openChangePasswordModal(user : IUser) {
    this.currentSelectedUser = user;
    this.isModalOpen = true;
  }

  closePasswordModal() {
    this.isModalOpen = false;
    this.currentSelectedUser = {};
  }

  ngOnDestroy(): void {
    // Set the state to false when leaving the Admin Dashboard
    this.userSerivce.setAdminDashboardState(false);
  }
}
