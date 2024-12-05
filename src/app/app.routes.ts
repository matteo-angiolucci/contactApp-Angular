import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guards/auth.guard';
import { UserListComponent } from './admin-dashboard/user-list/user-list.component';
import { ProductHomeComponent } from './product/product-home/product-home.component';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { FourCardLayoutGridExComponent } from './four-card-layout-grid-ex/four-card-layout-grid-ex.component';
import { PickProjectPageComponent } from './pick-project-page/pick-project-page.component';
import { TodoListComponent } from './todo-list/todo-list.component';

export const routes: Routes = [
  { path:'projects' , component: PickProjectPageComponent},
  { path: 'contact-app' , component : HomeComponent , title: "App - Contatti", canActivate:[authGuard]},
  { path: 'cart-products' , component : ProductHomeComponent},
  { path: 'credit-card-layout' , component : CreditCardComponent},
  { path: '4layout' , component : FourCardLayoutGridExComponent},
  { path: 'todolist' , component : TodoListComponent},
  //{ path: 'contact-details', component: ContactDetailComponent, canActivate:[authGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register' , component: RegisterComponent},
  { path: 'admin-dashboard' , component: UserListComponent, canActivate:[authGuard]},

  { path: '' , redirectTo : '/projects', pathMatch: 'prefix'}
];
