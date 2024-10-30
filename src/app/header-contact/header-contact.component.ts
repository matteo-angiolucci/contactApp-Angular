import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { AuthDirective } from 'app/utility/directives/auth.directive';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-header-contact',
  standalone: true,
  imports: [CommonModule, AsyncPipe, AuthDirective],
  templateUrl: './header-contact.component.html',
  styleUrl: './header-contact.component.less',
})
export class HeaderContactComponent{
  user$: Observable<ILoginResponse | null>;
  adminDashbaord$ : Observable<boolean> = of(false);

  constructor(private authService: AuthService, private router: Router , private userService : UserService) {
    this.user$ = this.authService.userLogged$;
    this.adminDashbaord$ = this.userService.isOnAdminDashboard$
  }



  goToSignUpPage() {
    this.router.navigate(['/login']);
  }

  logOut() {
    this.router.navigate(['/login']);
    this.authService.unsetUser();
  }

  // Toggle the state when clicking the button
  toggleAdminDashboard() {

    const isOnAdminDashboard = this.userService.getAdminDashboardState();

    // Toggle the state using the service's method
    this.userService.setAdminDashboardState(!isOnAdminDashboard);

    // Navigate based on the new state
    if (isOnAdminDashboard) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/admin-dashboard']);
    }
  }
}
