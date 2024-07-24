import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { boUserModel } from '../models/backofficeUser.model';
import { jwtDecode } from 'jwt-decode';
import { map, catchError } from 'rxjs/operators';
import { vesselModel } from '../models/vesselModel';

@Injectable({
  providedIn: 'root'
})
export class boUserService {
  private apiUrl = 'https://localhost:7071/api';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(compNo: string, userCode: string, userPass: string): Observable<any> {
    const loginData = { compNo: compNo, userNo: userCode, userPass: userPass };
    return this.http.post<any>(`${this.apiUrl}/controller/login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(user => {
        if (user && user.accessToken) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  refreshToken(): Observable<any> {
    const currentUser = this.currentUserValue;
    if (currentUser && currentUser.refreshToken) {
      return this.http.post<any>(`${this.apiUrl}/controller/refresh`, {
        accessToken: currentUser.accessToken,
        refreshToken: currentUser.refreshToken
      }).pipe(
        map(user => {
          if (user && user.accessToken) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return user;
        }),
        catchError(this.handleError)
      );
    }
    return throwError("Refresh token not available");
  }

  getUsers(): Observable<boUserModel[]> {
    return this.http.get<boUserModel[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getVessels(): Observable<vesselModel[]> {
    const currentUser = this.currentUserValue;
    const decodedToken = this.decodeToken(currentUser?.accessToken);
    const compNo = decodedToken?.CompNo;

    if (!compNo) {
      return throwError("Invalid company number");
    }

    console.log('API Call with Company Number:', compNo);
    return this.http.post<vesselModel[]>(`${this.apiUrl}/controller/vessels`, { CompNo: compNo }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  createVessel(vessel: vesselModel): Observable<vesselModel> {
    return this.http.post<vesselModel>(`${this.apiUrl}/controller/addVessel`, vessel, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteVessel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/controller/deleteVessel/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<boUserModel> {
    return this.http.get<boUserModel>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: boUserModel): Observable<boUserModel> {
    return this.http.post<boUserModel>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: number, user: boUserModel): Observable<boUserModel> {
    return this.http.put<boUserModel>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      this.logout();
    }
    return throwError(error);
  }
}
