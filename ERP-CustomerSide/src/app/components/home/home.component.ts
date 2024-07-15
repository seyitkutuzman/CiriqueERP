import { Component, OnInit } from '@angular/core';
import { BlankComponent } from '../blank/blank.component';
import { SectionComponent } from '../section/section.component';
import { SharedModule } from '../../modules/shared.module';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../service/auth.service';
import { boUserService } from '../../service/backOfficeUser.service';
import { userInfoService } from '../../service/userInfo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: boUserService,
    private userInfo: userInfoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      this.userService.refreshToken().subscribe(
        response => {
          // Refresh token geçerli ise, yeni token'ları saklayın ve kullanıcı bilgilerini güncelleyin
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          const decodedUser = this.userService.decodeToken(response.accessToken);
          this.userInfo.setUser(decodedUser);
        },
        error => {
          // Refresh token geçerli değilse kullanıcıyı giriş sayfasına yönlendirin
          this.router.navigate(['/login']);
        }
      );
    } else {
      // Token yoksa kullanıcıyı giriş sayfasına yönlendirin
      this.router.navigate(['/login']);
    }
  }
}
