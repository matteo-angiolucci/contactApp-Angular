import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';

export const routes: Routes = [
  { path: 'home' , component : HomeComponent , title: "App - Contatti"},
  { path: 'contact-details', component: ContactDetailComponent },

  { path: '' , redirectTo : '/home', pathMatch: 'prefix'}
];
