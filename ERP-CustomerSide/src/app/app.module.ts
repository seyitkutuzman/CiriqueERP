import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ReactiveFormsModule'ü ekleyin
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './service/jwt.interceptor';
import { MainService } from './service/MainService.service';
import { CocMowComponent } from './components/Technical/coc-mow/coc-mow.component';
import { RegulatoryInformationComponent } from './components/regulatory/regulatory.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, // ReactiveFormsModule'ü burada ekleyin
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AppComponent,
    LoginComponent,
    CocMowComponent,
    RegulatoryInformationComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    MainService
  ],
  bootstrap: []
})
export class AppModule { }
