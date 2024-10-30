import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // Import FormControl and ReactiveFormsModule
import { IUser } from '@dm/user.model';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangePasswordModalComponent } from "../change-password-modal/change-password-modal.component";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChangePasswordModalComponent], // Import ReactiveFormsModule
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less'],
})
export class UserListComponent implements OnInit {
  loggedUser: IUser | null = null;
  users$: Observable<IUser[]> = of([]);
  filteredUsers$: Observable<IUser[]> = of([]);
  searchControl = new FormControl(''); // FormControl for the search box
  isModalOpen$: Observable<boolean> = of(false);

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isModalOpen$ = this.userService.openPasswordChangeModal$;

    this.userService.setAdminDashboardState(true);

    // Use combineLatest to filter out the logged-in user from the user list and implement search functionality
    this.filteredUsers$ = combineLatest([
      this.authService.userLogged$,
      this.userService.userList$,
      this.searchControl.valueChanges.pipe(startWith('')) // Listen to search input changes
    ]).pipe(
      map(([loggedUser, users, searchTerm]) => {
        this.loggedUser = loggedUser;

        // Filter out the logged-in user
        let filteredUsers = users.filter(user => user.email !== loggedUser?.email);

        // Apply search filter if there's a search term
        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filteredUsers = filteredUsers.filter(user =>
            user.email?.toLowerCase().includes(lowerCaseSearchTerm)
          );
        }

        return filteredUsers;
      })
    );
  }

  // Method to clear the search input
  clearSearch(): void {
    this.searchControl.setValue('');
  }

  onToggleUserStatus(user: IUser, newStatus: boolean) {
    if (this.loggedUser) {
      this.userService.updateUserStatus(this.loggedUser, user, newStatus).subscribe({
        next: (response) => {
          console.log(`${user.email}'s status updated.`);
        },
        error: (err) => {
          console.error('Error updating user status:', err);
        },
      });
    }
  }

  openChangePasswordModal(user: IUser) {
    this.userService.setCurrentUser(user);
    this.userService.openPasswordModal(true);
  }

  closePasswordModal() {
    this.userService.openPasswordModal(false);
    this.userService.setCurrentUser(null);
  }

  getStatus(user: IUser): string {
    return user.active ? 'Lock' : 'Unlock';
  }
}
