import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { AuthDirective } from 'app/utility/directives/auth.directive';
import { filter, Observable, of } from 'rxjs';


@Component({
  selector: 'app-header-contact',
  standalone: true,
  imports: [CommonModule, AsyncPipe, AuthDirective],
  templateUrl: './header-contact.component.html',
  styleUrl: './header-contact.component.less',
})
export class HeaderContactComponent implements OnInit{
  user$: Observable<ILoginResponse | null>;
  adminDashbaord$ : Observable<boolean> = of(false);
  showHeader = true;

  constructor(private authService: AuthService, private router: Router , private userService : UserService) {
    this.user$ = this.authService.userLogged$;
    this.adminDashbaord$ = this.userService.isOnAdminDashboard$;

  }
  ngOnInit(): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      // Check if the URL contains the specific word
      this.showHeader = !event.url.includes('creditcard');
    });
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
