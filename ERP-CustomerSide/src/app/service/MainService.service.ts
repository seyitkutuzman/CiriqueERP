  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
  import { BehaviorSubject, Observable, throwError } from 'rxjs';
  import { boUserModel } from '../models/User.model';
  import {jwtDecode} from 'jwt-decode';
  import { map, catchError } from 'rxjs/operators';
  import { vesselModel } from '../models/vesselModel';
  import { regulatoryModel } from '../models/regulatoryModel';
  import { mownerModel } from '../models/mownerModel';
  import { DocumentEquipment } from '../models/documentEquipment.model';
  import { DocumentSection } from '../models/DocumentSection.model';
  import { DocumentType } from '../models/documentType.model';
  import { Certificate } from '../models/certificate.model';
  import { EquipmentCounter } from '../models/equipment-counter.model';
  import { of } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class MainService {
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    private apiUrl = 'https://localhost:7071/api';
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
      this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
      return this.currentUserSubject.value;
    }

    
    getCurrentCompNo(): number {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return currentUser ? Number(localStorage.getItem('compNo')) || 0 : 0;
    }

    login(compNo: string, userCode: string, userPass: string): Observable<any> {
      const loginData = { compNo: compNo, userNo: userCode, userPass: userPass };
      return this.http.post<any>(`${this.apiUrl}/controller/login`, loginData, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        map(user => {
          if (user && user.accessToken) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('compNo', compNo); // compNo bilgisini localStorage'a kaydedin
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

    getCurrentUserName(): Observable<string> {
      const currentUser = this.currentUserValue;
      if (currentUser && currentUser.accessToken) {
        const decodedToken = this.decodeToken(currentUser.accessToken);
        const userName = decodedToken?.name || '';
        return of(userName);
      }
      return of('');
    }

    getVessels(): Observable<vesselModel[]> {
      const compNo = localStorage.getItem('compNo'); // compNo bilgisini localStorage'dan alın
      
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
      console.log('Create Vessel Payload:', vessel);
      return this.http.post<vesselModel>(`${this.apiUrl}/controller/addVessel`, vessel, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }

    updateVessel(vessel: vesselModel): Observable<vesselModel> {
      console.log('Update Vessel Payload:', vessel);
      return this.http.put<vesselModel>(`${this.apiUrl}/controller/updateVessel`, vessel, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
    
    deleteVessel(id: number): Observable<void> {
      console.log('Delete Vessel ID:', id);
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
      console.error('An error occurred:', error.message);
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
      console.log('Create Memo Payload:', vessel);
      return this.http.post<mownerModel>(`${this.apiUrl}/controller/addMowner`, vessel, {
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
      console.log('Delete Memo ID:', id);
      return this.http.delete<void>(`${this.apiUrl}/controller/deleteMowner/${id}`, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
    getDocumentEquipments(compNo: number): Observable<DocumentEquipment[]> {
      console.log('Fetching Document Equipments for compNo:', compNo);
      return this.http.get<DocumentEquipment[]>(`${this.apiUrl}/controller/GetAllDocEq/${compNo}`, {
        headers: { 'Content-Type': 'application/json' },
        params: { compNo: compNo.toString() }  // compNo parametresini query parametre olarak ekliyoruz
      }).pipe(
        catchError(this.handleError)
      );
    }
    
    addDocumentEquipment(documentEquipment: DocumentEquipment, compNo: number): Observable<DocumentEquipment> {
      documentEquipment.compNo = compNo;  // compNo değerini documentEquipment nesnesine ekliyoruz
      console.log('Add Document Equipment Payload:', documentEquipment);
      return this.http.post<DocumentEquipment>(`${this.apiUrl}/controller/AddDocEq`, documentEquipment, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
    
    updateDocumentEquipment(id: number, documentEquipment: DocumentEquipment, compNo: number): Observable<void> {
      documentEquipment.compNo = compNo;  // compNo değerini documentEquipment nesnesine ekliyoruz
      console.log('Update Document Equipment ID:', id, 'Payload:', documentEquipment);
      return this.http.put<void>(`${this.apiUrl}/controller/UpdateDocEq/${id}`, documentEquipment, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
    
    deleteDocumentEquipment(id: number, compNo: number): Observable<void> {
      console.log('Delete Document Equipment ID:', id, 'for compNo:', compNo);
      return this.http.delete<void>(`${this.apiUrl}/controller/DeleteDocEq/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        params: { compNo: compNo.toString() }  // compNo parametresini query parametre olarak ekliyoruz
      }).pipe(
        catchError(this.handleError)
      );
    }
    
    getDocumentSections(compNo: number): Observable<DocumentSection[]> {
      return this.http.get<DocumentSection[]>(`${this.apiUrl}/controller/GetAllDocSections/${compNo}`, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    addDocumentSection(documentSection: DocumentSection): Observable<DocumentSection> {
      return this.http.post<DocumentSection>(`${this.apiUrl}/controller/AddDocSection`, documentSection, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    updateDocumentSection(id: number, documentSection: DocumentSection): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/controller/UpdateDocSection/${id}`, documentSection, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    deleteDocumentSection(id: number, compNo: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/controller/DeleteDocSection/${id}/${compNo}`, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    getDocumentTypes(compNo: string): Observable<DocumentType[]> {
      console.log('Fetching all Document Types for compNo:', compNo);
      return this.http.get<DocumentType[]>(`${this.apiUrl}/controller/GetAllDocTypes/${compNo}`, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
    
    addDocumentType(documentType: DocumentType, compNo: number): Observable<DocumentType> {
      documentType.compNo = compNo; // compNo'yu documentType'a ekliyoruz
      console.log('Add Document Type Payload:', documentType);
      return this.http.post<DocumentType>(`${this.apiUrl}/controller/AddDocType`, documentType, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
        );
    }
    
    updateDocumentType(id: number, documentType: DocumentType, compNo: number): Observable<void> {
      documentType.compNo = compNo; // compNo'yu documentType'a ekliyoruz
      console.log('Update Document Type ID:', id, 'Payload:', documentType);
      return this.http.put<void>(`${this.apiUrl}/controller/UpdateDocType/${id}/${compNo}`, documentType, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
    
    deleteDocumentType(id: number, compNo: string): Observable<void> {
      console.log('Delete Document Type ID:', id, 'compNo:', compNo);
      return this.http.delete<void>(`${this.apiUrl}/controller/DeleteDocType/${id}/${compNo}`, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
    

    getCertificates(compNo: string): Observable<Certificate[]> {
      return this.http.get<Certificate[]>(`${this.apiUrl}/controller/GetAllCertificates/${compNo}`, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
  
    addCertificate(certificate: Certificate, compNo: number): Observable<Certificate> {
      certificate.compNo = compNo; // CompNo'yu certificate objesine ekliyoruz
      return this.http.post<Certificate>(`${this.apiUrl}/controller/AddCertificate`, certificate, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
  
    updateCertificate(id: number, certificate: Certificate, compNo: number): Observable<void> {
      certificate.compNo = compNo; // CompNo'yu certificate objesine ekliyoruz
      return this.http.put<void>(`${this.apiUrl}/controller/UpdateCertificate/${id}`, certificate, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
  
    deleteCertificate(id: number, compNo: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/controller/DeleteCertificate/${id}/${compNo}`, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
  getEquipmentCounters(compNo: number): Observable<EquipmentCounter[]> {
  return this.http.get<EquipmentCounter[]>(`${this.apiUrl}/controller/getCounters/${compNo}`, this.httpOptions)
    .pipe(catchError(this.handleError));
}
  addEquipmentCounter(equipmentCounter: EquipmentCounter): Observable<EquipmentCounter> {
    console.log('Adding Equipment Counter:', equipmentCounter);
    return this.http.post<EquipmentCounter>(`${this.apiUrl}/controller/addCounter`, equipmentCounter, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateEquipmentCounter(id: number, equipmentCounter: EquipmentCounter): Observable<void> {
    console.log('Updating Equipment Counter ID:', id, 'Payload:', equipmentCounter);
    return this.http.put<void>(`${this.apiUrl}/controller/updateCounter/${id}`, equipmentCounter, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteEquipmentCounter(id: number): Observable<void> {
    console.log('Delete Equipment Counter ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/controller/deleteCounter/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  }




