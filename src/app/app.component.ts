import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderContactComponent } from "./header-contact/header-contact.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'my-contacts';
}
