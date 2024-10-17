import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'home' , component : HomeComponent , title: "App - Contatti", canActivate:[authGuard]},
  { path: 'contact-details', component: ContactDetailComponent, canActivate:[authGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register' , component: RegisterComponent},

  { path: '' , redirectTo : '/home', pathMatch: 'prefix'}
];
