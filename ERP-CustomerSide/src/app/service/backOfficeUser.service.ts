// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { boUserModel } from '../models/backofficeUser.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class boUserService {
  private apiUrl = 'https://localhost:7071/api';

  constructor(private http: HttpClient) { }




  login(compNo: string, userCode: string, userPass: string): Observable<any> {
    const loginData = {compNo: compNo, userNo: userCode, userPass: userPass };
    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refreshToken: refreshToken }, {
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
