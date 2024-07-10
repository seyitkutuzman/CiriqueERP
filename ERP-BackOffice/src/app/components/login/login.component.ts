import { boUserModel } from '../../models/backofficeUser.model';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { boUserService } from '../../service/backOfficeUser.service';
import { SwalService } from '../../service/swal.service';
import {Router} from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { userCode: '', userPass: '' };

  constructor(private userService: boUserService,
    private swal: SwalService,
    private router: Router
  ) {}

  onSubmit() {
    this.userService.login(this.loginData.userCode, this.loginData.userPass).subscribe(response => {
      this.swal.callToast('Giriş Başarılı','Giriş Başarılı',3000,false)
      this.router.navigate([''])
      console.log('Login successful:', response);
    }, error => {
      console.error('Login failed:', error);
    });
  }
}
