import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { routes } from './app/app-routing.module'; // routes dizisini import ediyoruz
import { JwtInterceptor } from './app/service/jwt.interceptor';
import { importProvidersFrom } from '@angular/core';
import { MainService } from './app/service/MainService.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // routes dizisini kullanıyoruz
    importProvidersFrom(HttpClientModule, FormsModule),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    MainService
  ]
}).catch(err => console.error(err));
