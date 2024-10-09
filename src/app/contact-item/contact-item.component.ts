import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IContactListItem } from '@dm/contact-list-item.model';

@Component({
  selector: 'app-contact-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.less'
})
export class ContactItemComponent {
  @Input() contact! : IContactListItem;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(){

  }
}
