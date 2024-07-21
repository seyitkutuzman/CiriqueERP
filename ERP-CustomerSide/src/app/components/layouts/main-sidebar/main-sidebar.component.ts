import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../../login/login.component';
import { boUserService } from '../../../service/backOfficeUser.service';
import { SwalService } from '../../../service/swal.service';
import { Router, RouterModule } from '@angular/router';
import { HttpService } from '../../../service/http.service';
import { userInfoService } from '../../../service/userInfo.service';
import { CocMowComponent } from '../../coc-mow/coc-mow.component';


@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [LoginComponent, CocMowComponent, RouterModule ],
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})




export class MainSidebarComponent implements OnInit {
navigator() {
  this.router.navigateByUrl('/coc-mow');
}
  userName: string='';

  constructor(private userService: userInfoService
    , private router: Router
    , private httpService: HttpService
    , private swalService: SwalService
    , private boUserService: boUserService
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.userName = `${user.name} ${user.surname}`; 
      }
    });
}

}
