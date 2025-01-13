
import { effect,  Injectable,  signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MultiLangService {

  languages = ['English', 'Italian', 'Spanish'];
  languageMap = { English: 'en', Italian: 'it', Spanish: 'es' };

    // Default language is English
    languageSignal = signal<{ longName: string; shortName: string }>({
      longName: 'English',
      shortName: 'en',
    });

  updateLanguage(language: string) {
    this.languageSignal.update(() => {
      switch (language) {
        case 'Italian':
          return { longName: 'Italian', shortName: 'it' };
          case 'English':
            return { longName: 'English', shortName: 'en' };
        case 'Spanish':
          return { longName: 'Spanish', shortName: 'es' };

        default:
          return { longName: 'English', shortName: 'en' };
      }
    });
  }
  constructor(private transalteService: TranslateService) {
    // Use an effect to update the translation whenever the language signal changes
    effect(() => {
      const currentLanguage = this.languageSignal();
      this.transalteService.use(currentLanguage.shortName); // Change the language in the translate service

    });
  }


}
