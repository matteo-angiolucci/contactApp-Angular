import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MultiLangService } from 'app/services/multi-lang.service';

@Component({
  selector: 'app-language-change-project',
  standalone: true,
  imports: [UpperCasePipe, TranslatePipe],
  templateUrl: './language-change-project.component.html',
  styleUrl: './language-change-project.component.less',
})
export class LanguageChangeProjectComponent {
  constructor(private multiLangService: MultiLangService) {}

  toggleLanguage(language: string) {
    if (this.multiLangService.languageSignal().longName !== language) {
      this.multiLangService.updateLanguage(language);
      console.log('Language changed to', language);
    }
  }

  get getCurrentLanguage(): { longName: string; shortName: string } {
    return this.multiLangService.languageSignal();
  }
}
