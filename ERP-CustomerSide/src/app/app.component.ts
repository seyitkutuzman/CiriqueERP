import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';
import { MainService } from './service/MainService.service';
import { userInfoService } from './service/userInfo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';  // NgbModal import edin

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
    private userService: MainService,
    private userInfo: userInfoService,
    private modalService: NgbModal  // NgbModal servisini ekleyin
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

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed ${reason}`);
      }
    );
  }
}
