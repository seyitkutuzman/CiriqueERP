import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { boUserService } from './backOfficeUser.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token:string = "";
  constructor(
    private router: Router,
    private userService: boUserService
  ) { }

  isAuthenticated(){
    this.token = localStorage.getItem("token") ?? "";
    const decode = jwtDecode(this.token);
    const exp = decode.exp ?? 0 ;
    const now = new Date().getTime() / 1000;

    if(now > exp){
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.userService.refreshToken(refreshToken).subscribe(response => {
        localStorage.setItem('accessToken', response.accessToken); // Yeni access token'ı sakla
        localStorage.setItem('refreshToken', response.refreshToken); // Yeni refresh token'ı sakla
      }, error => {
        console.error('Refresh token failed:', error);
        // Hata durumunda uygun işlemleri yapın
      });
    }
  }
}
