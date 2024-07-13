// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule, // FormsModule'ü burada import edin
    HttpClientModule,
    LoginComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
