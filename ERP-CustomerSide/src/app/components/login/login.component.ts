import { boUserModel } from '../../models/backofficeUser.model';
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { boUserService } from '../../service/backOfficeUser.service';
import { SwalService } from '../../service/swal.service';
import {Router} from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpService } from '../../service/http.service';
import { userInfoService } from '../../service/userInfo.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { compNo:'', userCode: '', userPass: '' };

  constructor(private userService: boUserService,
    private swal: SwalService,
    private router: Router,
    private http: HttpService,
    private userInfo: userInfoService
  ) {}

  onSubmit() {
    
    this.userService.login(this.loginData.compNo ,this.loginData.userCode, this.loginData.userPass).subscribe(response => 
    {
      this.swal.callToast('Giriş Başarılı','Giriş Başarılı',3000,false)
      this.userInfo.setUser(response)

      const decodedUser = this.userService.decodeToken(response.accessToken);
      this.userInfo.setUser(decodedUser); 
      localStorage.setItem('accessToken', response.accessToken); 
      localStorage.setItem('refreshToken', response.refreshToken); 

      this.router.navigate([''])
      console.log('Login successful:', response);
    }, error => {
      this.swal.callToast('Giriş Başarısı ',Response.error.toString(),3000,false)
      console.error('Login failed:', error);
    });
  }
}
