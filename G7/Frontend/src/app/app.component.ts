import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public credentialsloaded = true;
  public httpLoaderIgnoreUrlPatterns: string[] = [];
  constructor(translate: TranslateService) {
    translate.setDefaultLang('pt-BR');
    translate.use('pt-BR');
  }
}
