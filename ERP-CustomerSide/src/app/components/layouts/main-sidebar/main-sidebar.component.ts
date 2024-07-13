import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../../login/login.component';
import { boUserService } from '../../../service/backOfficeUser.service';
import { SwalService } from '../../../service/swal.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../service/http.service';
import { userInfoService } from '../../../service/userInfo.service';


@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.css'
})




export class MainSidebarComponent implements OnInit {
  userName: string='';

  constructor(private userService: userInfoService) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.userName = `${user.name} ${user.surname}`; 
      }
    });
}

}
