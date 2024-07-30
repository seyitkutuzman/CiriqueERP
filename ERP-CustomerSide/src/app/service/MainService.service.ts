import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { boUserModel } from '../models/backofficeUser.model';
import { jwtDecode } from 'jwt-decode';
import { map, catchError } from 'rxjs/operators';
import { vesselModel } from '../models/vesselModel';
import { regulatoryModel } from '../models/regulatoryModel';
import { mownerModel } from '../models/mownerModel';
import { DocumentEquipment } from '../models/documentEquipment.model';

@Injectable({
  providedIn: 'root'
})
export class MainService {
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
  
    console.log('API Call with Company Number:', compNo);  // Şirket numarasını kontrol edin.
    return this.http.post<vesselModel[]>(`${this.apiUrl}/controller/vessels`, { CompNo: compNo }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  
  getAllVessels(): Observable<vesselModel[]> {
    const currentUser = this.currentUserValue;
    const decodedToken = this.decodeToken(currentUser?.accessToken);
    const compNo = decodedToken?.CompNo;
  
    if (!compNo) {
      return throwError("Invalid company number");
    }
  
    console.log('API Call with Company Number:', compNo);  // Şirket numarasını kontrol edin.
    return this.http.post<vesselModel[]>(`${this.apiUrl}/controller/ownedVessels`, { CompNo: compNo }, {
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

  updateVessel(vessel: vesselModel): Observable<vesselModel> {
    return this.http.put<vesselModel>(`${this.apiUrl}/controller/updateVessel`, vessel, {
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

  getRegulatoryInfo(): Observable<regulatoryModel[]> {
    return this.http.get<regulatoryModel[]>(`${this.apiUrl}/controller/regulatoryInfo`);
  }

  createRegulatoryInfo(info: regulatoryModel): Observable<regulatoryModel> {
    return this.http.post<regulatoryModel>(`${this.apiUrl}/controller/regulatoryInfo`, info);
  }

  deleteRegulatoryInfo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/controller/regulatoryInfo/${id}`);
  }
  
  updateRegulatoryInfo(regulatory: regulatoryModel): Observable<regulatoryModel> {
    return this.http.put<regulatoryModel>(`${this.apiUrl}/controller/updateRegulatory`, regulatory);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      this.logout();
    }
    return throwError(error);
  }

  getMemos(): Observable<mownerModel[]> {
    const currentUser = this.currentUserValue;
    const decodedToken = this.decodeToken(currentUser?.accessToken);
    const compNo = decodedToken?.CompNo;
  
    if (!compNo) {
      return throwError("Invalid company number");
    }
  
    console.log('API Call with Company Number:', compNo);  // Şirket numarasını kontrol edin.
    return this.http.post<mownerModel[]>(`${this.apiUrl}/controller/Mowners`, { CompNo: compNo }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  createMemo(vessel: mownerModel): Observable<mownerModel> {
    return this.http.post<vesselModel>(`${this.apiUrl}/controller/addMowner`, vessel, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }
  updateMemo(vessel: mownerModel): Observable<mownerModel> {
    console.log('Updating memo:', vessel); // Güncellenen verileri kontrol edin
    return this.http.put<mownerModel>(`${this.apiUrl}/controller/updateMowner`, vessel, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }  
  
  deleteMemo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/controller/deleteMowner/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }
  getDocumentEquipments(): Observable<DocumentEquipment[]> {
    return this.http.get<DocumentEquipment[]>(this.apiUrl);
  }

  addDocumentEquipment(documentEquipment: DocumentEquipment): Observable<DocumentEquipment> {
    return this.http.post<DocumentEquipment>(this.apiUrl, documentEquipment);
  }

  updateDocumentEquipment(id: number, documentEquipment: DocumentEquipment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, documentEquipment);
  }

  deleteDocumentEquipment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
