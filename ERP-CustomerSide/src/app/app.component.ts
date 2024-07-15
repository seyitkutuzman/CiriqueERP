import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';
import { boUserService } from './service/backOfficeUser.service';
import { userInfoService } from './service/userInfo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  title = 'ERP-BackOffice';

  constructor(
    private authService: AuthService,
    private userService: boUserService,
    private userInfo: userInfoService
  ) {}

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken) {
      const decodedUser = this.userService.decodeToken(accessToken);
      this.userInfo.setUser(decodedUser);
    }

    if (refreshToken) {
      this.authService.refreshToken(); 
    }
  }
}
