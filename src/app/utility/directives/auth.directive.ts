import {
  Directive,
  effect,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UserRole } from '@dm/roles';
import { AuthService } from 'app/services/auth.service';

@Directive({
  selector: '[appAuth]',
  standalone: true,
})
export class AuthDirective {
  private allowedRoles: UserRole[] = [];

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {

    effect(() => {
      const userRole = this.authService.userRoleSignal();
      if (this.allowedRoles.includes(userRole)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });


  }

  @Input() set appAuth(roles: UserRole[]) {
    this.allowedRoles = roles;

    // Subscribe to the user's role observable WITH OBS
    // this.authService.userRole$().subscribe((userRole) => {
    //   if (this.allowedRoles.includes(userRole!)) {
    //     // Show the content if the user role matches
    //     this.viewContainer.createEmbeddedView(this.templateRef);
    //   } else {
    //     // Otherwise, clear the content
    //     this.viewContainer.clear();
    //   }
    // });

    // USING A SIGNAL we call the effect function that revaluates all the time the userRoleSignal changes


  }
}
