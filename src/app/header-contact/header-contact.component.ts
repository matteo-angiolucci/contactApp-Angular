import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { UserRole } from '@dm/roleEnum.enum';
import { AuthService } from 'app/services/auth.service';
import { LocalStorageService } from 'app/services/local-storage.service';
import { UserService } from 'app/services/user.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-header-contact',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './header-contact.component.html',
  styleUrl: './header-contact.component.less',
})
export class HeaderContactComponent implements OnInit{
  user$: Observable<ILoginResponse | null>;
  isOnAdminDashboard = false;
  userRoles = UserRole;

  constructor(private authService: AuthService, private route: Router , private userService : UserService,private localStorageService: LocalStorageService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
     this.userService.isOnAdminDashboard$.subscribe(isOnAdminDashboard => {
      this.isOnAdminDashboard = isOnAdminDashboard;
    });
  }


  goToSignUpPage() {
    this.route.navigate(['/login']);
  }

  logOut() {
    this.localStorageService.removeItem('currentUser');
    this.route.navigate(['/login']);
    this.authService.unsetUser();
  }

  goToAdminorGoBack() {
    if (!this.isOnAdminDashboard) {
     this.route.navigate(['/admin-dashboard'])
    } else {
      this.route.navigate(['/home'])
    }
  }
}
