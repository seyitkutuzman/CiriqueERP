// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { boUserModel } from '../models/backofficeUser.model';

@Injectable({
  providedIn: 'root'
})
export class boUserService {
  private apiUrl = 'http://localhost:5274/api';

  constructor(private http: HttpClient) { }




  login(userCode: string, userPass: string): Observable<any> {
    const loginData = { userNo: userCode, userPass: userPass }; // API'nin beklediği alan adlarını kullanın
    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getUsers(): Observable<boUserModel[]> {
    return this.http.get<boUserModel[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<boUserModel> {
    return this.http.get<boUserModel>(`${this.apiUrl}/${id}`);
  }
  
  createUser(user: boUserModel): Observable<boUserModel> {
    return this.http.post<boUserModel>(this.apiUrl, user);
  }

  updateUser(id: number, user: boUserModel): Observable<boUserModel> {
    return this.http.put<boUserModel>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
