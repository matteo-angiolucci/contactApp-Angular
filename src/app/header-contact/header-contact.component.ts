import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginResponse } from '@dm/ILogin-response.model';
import { AuthService } from 'app/services/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-header-contact',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './header-contact.component.html',
  styleUrl: './header-contact.component.less',
})
export class HeaderContactComponent{
  user$: Observable<ILoginResponse | null>;


  constructor(private authService: AuthService, private route: Router) {
    this.user$ = this.authService.user$;
  }


  goToSignUpPage() {
    this.route.navigate(['/login']);
  }

  logOut() {
    this.route.navigate(['/login']);
    this.authService.unsetUser();
  }
}
