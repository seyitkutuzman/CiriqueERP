import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { ControlSidebarComponent } from './control-sidebar/control-sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { boUserService } from '../../service/backOfficeUser.service';
import { AuthService } from '../../service/auth.service';
import { userInfoService } from '../../service/userInfo.service';
import { CocMowComponent } from '../coc-mow/coc-mow.component';

@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MainSidebarComponent,ControlSidebarComponent,FooterComponent,CocMowComponent],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.css'
})
export class LayoutsComponent implements OnInit {

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
