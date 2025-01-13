import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'environments/environment';

// This is the HttpLoaderFactory function
export function HttpLoaderFactory(http: HttpClient) {
  // Use your API endpoint for translation loading
  return new TranslateHttpLoader(http, environment.TRANSALTIONS_URL, '');
}
