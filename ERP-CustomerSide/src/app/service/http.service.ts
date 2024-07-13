import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../constants';
import { resultModel } from '../models/result.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private auth: AuthService) {}
  
  post<T>(apiUrl:string, body:any, callBack:(res:T)=> void, errorCallBack?:()=> void){
    this.http.post<resultModel<T>>(`${api}/${apiUrl}`, body,{
      headers:
      {"Authorization": "bearer" + this.auth.token}
    }).subscribe({
      next: (res)=> {
        if(res.data){
          callBack(res.data)
        }
      },
      error: (err:HttpErrorResponse)=>{
        if(errorCallBack){
          errorCallBack()
        }
      }
    })
  }
}

