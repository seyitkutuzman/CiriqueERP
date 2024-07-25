import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { boUserService } from '../../../service/backOfficeUser.service';
import { SwalService } from '../../../service/swal.service';
import { HttpService } from '../../../service/http.service';
import { userInfoService } from '../../../service/userInfo.service';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarComponent implements OnInit {
  userName: string = '';

  constructor(private userService: userInfoService,
              private router: Router,
              private httpService: HttpService,
              private swalService: SwalService,
              private boUserService: boUserService) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.userName = `${user.name} ${user.surname}`;
      }
    });
  }
  logout(){
    this.boUserService.logout();
  }
  
}
