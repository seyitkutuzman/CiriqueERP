import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { boUserService } from './backOfficeUser.service';
import { SwalService } from './swal.service';
import { empty, isEmpty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token:string = "";
  constructor(
    private router: Router,
    private userService: boUserService,
    private swal: SwalService
  ) { }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.userService.refreshToken().subscribe(response => {
        localStorage.setItem('accessToken', response.accessToken); // Yeni access token'ı sakla
        localStorage.setItem('refreshToken', response.refreshToken); // Yeni refresh token'ı sakla
      }, error => {        
        console.error('Refresh token failed:', error);
        if(refreshToken){
          this.swal.callToast('Oturum Süresi Zaman Aşımına Uğramıştır.','',3000,false,'error','top')
          localStorage.removeItem('accessToken'); // Yeni access token'ı sakla
          localStorage.removeItem('refreshToken');
        }
        this.router.navigate(['/login'])
      });
    }
  }
}
