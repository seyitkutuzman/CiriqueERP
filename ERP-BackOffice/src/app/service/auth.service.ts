import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token:string = "";
  constructor(
    private router: Router
  ) { }

  isAuthenticated(){
    this.token = localStorage.getItem("token") ?? "";
    const decode = jwtDecode(this.token);
    const exp = decode.exp ?? 0 ;
    const now = new Date().getTime() / 1000;

    if(now > exp){
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}
