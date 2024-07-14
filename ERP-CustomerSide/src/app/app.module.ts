import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './service/jwt.interceptor';
import { boUserService } from './service/backOfficeUser.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AppComponent, // Standalone bileşen olarak ekliyoruz
    LoginComponent // Standalone bileşen olarak ekliyoruz
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    boUserService
  ],
  bootstrap: [] // Burada da standalone bileşeni belirtiyoruz
})
export class AppModule { }
