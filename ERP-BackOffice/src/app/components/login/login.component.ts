// login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginData = { username: '', password: '' };

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://your-api-url/api/auth/login', this.loginData)
      .subscribe(response => {
        // Do something with the response
        console.log(response);
      }, error => {
        // Handle error
        console.error(error);
      });
  }
}
