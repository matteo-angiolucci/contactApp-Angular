import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guards/auth.guard';
import { UserListComponent } from './admin-dashboard/user-list/user-list.component';
import { ProductHomeComponent } from './product/product-home/product-home.component';
import { CreditCardComponent } from './credit-card/credit-card.component';

export const routes: Routes = [
  { path: 'home' , component : HomeComponent , title: "App - Contatti", canActivate:[authGuard]},
  { path: 'product' , component : ProductHomeComponent},
  { path: 'creditcard' , component : CreditCardComponent},
  //{ path: 'contact-details', component: ContactDetailComponent, canActivate:[authGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register' , component: RegisterComponent},
  { path: 'admin-dashboard' , component: UserListComponent, canActivate:[authGuard]},

  { path: '' , redirectTo : '/home', pathMatch: 'prefix'}
];
