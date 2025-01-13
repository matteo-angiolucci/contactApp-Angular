import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-pick-project-page',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './pick-project-page.component.html',
  styleUrl: './pick-project-page.component.less'
})
export class PickProjectPageComponent {

}
