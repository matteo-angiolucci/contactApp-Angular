import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MultiLangService } from 'app/services/multi-lang.service';

@Component({
  selector: 'app-language-modal',
  standalone: true,
  imports: [NgFor,NgClass,TranslatePipe],
  templateUrl: './language-modal.component.html',
  styleUrl: './language-modal.component.less'
})
export class LanguageModalComponent {

  constructor(private multiLangService: MultiLangService){

  }

  get currentLanguage() {
    return this.multiLangService.languageSignal();
  }

  get languages() {
    return this.multiLangService.languages;
  }

  selectLanguage(language: string) {
    this.multiLangService.updateLanguage(language); // Update language via the service
  }


}
