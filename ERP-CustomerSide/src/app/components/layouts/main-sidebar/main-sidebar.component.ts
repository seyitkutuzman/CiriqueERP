import { Component } from '@angular/core';
import { LoginComponent } from '../../login/login.component';
import { boUserService } from '../../../service/backOfficeUser.service';
import { SwalService } from '../../../service/swal.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../service/http.service';


@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.css'
})




export class MainSidebarComponent {
  addData = {ID: 0,userCode: '', userPass: '', department: 0, createDate: new Date, modifyDate: new Date, name: '', surname:''}
  constructor(private userService: boUserService,
    private swal: SwalService,
    private router: Router,
    private http: HttpService
  ) {}

  addDelete(){
    this.userService.createUser(this.addData).subscribe(response=>{
      
      this.swal.callToast('Kullanıcı Ekleme Başarılı','',3000,false)
      

    }, error=>{
      this.swal.callToast('kullanıcı ekleme başarısız', '',3000,false)
    }
  ) 
    
    

  }
}


