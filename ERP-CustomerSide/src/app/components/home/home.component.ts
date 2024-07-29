import { Component, OnInit } from '@angular/core';
// Remove unused imports
import { SharedModule } from '../../modules/shared.module';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../service/auth.service';
import {MainService } from '../../service/MainService.service';
import { userInfoService } from '../../service/userInfo.service';
import { Router } from '@angular/router';
import { CocMowComponent } from "../Technical/coc-mow/coc-mow.component";
import { MainSidebarComponent } from '../layouts/main-sidebar/main-sidebar.component';
import { SwalService } from '../../service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, LoginComponent, CocMowComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  constructor(
    private userService: MainService,
    private userInfo: userInfoService,
    private router: Router,
    private swal: SwalService
  ) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      this.userService.refreshToken().subscribe({
        next: response => {
          // Refresh token geçerli ise, yeni token'ları saklayın ve kullanıcı bilgilerini güncelleyin
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
      
          const decodedUser = this.userService.decodeToken(response.accessToken);
          this.userInfo.setUser(decodedUser);
          this.swal.callToast('Welcome', 'Welcome to the CiriqueERP',3000,false,'success','top')
        },
        error: error => {
          // Refresh token geçerli değilse kullanıcıyı giriş sayfasına yönlendirin
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
}
}
