import { BrowserModule } from '@angular/platform-browser';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  APP_INITIALIZER,
  NgModule,
} from '@angular/core';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { pt_BR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import {
  AppInitializerFactory,
  AppInitializerService,
} from './core/initializer/app-initializer.service';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { UrlInterceptor } from './core/interceptor/url.interceptor';
import { AppComponent } from './app.component';
import { EnvServiceProvider } from './core/env/env.service.provider';

registerLocaleData(pt);

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/');
}

const I18N_SERVICE_MODULE = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  }),
];

const APP_INITIALIZER_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: AppInitializerFactory,
    deps: [AppInitializerService],
    multi: true,
  },
];

const HTTP_INTERCEPTORS_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ...I18N_SERVICE_MODULE,
  ],
  providers: [
    EnvServiceProvider,
    { provide: NZ_I18N, useValue: pt_BR },
    ...APP_INITIALIZER_PROVIDERS,
    ...HTTP_INTERCEPTORS_PROVIDERS,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
