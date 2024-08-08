  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
  import { BehaviorSubject, Observable, throwError } from 'rxjs';
  import { boUserModel } from '../models/backofficeUser.model';
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
      // Optional: Add router.navigate(['/login']); if you want to navigate to login on logout
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
    getDocumentEquipments(): Observable<DocumentEquipment[]> {
      console.log('Fetching all Document Equipments');
      return this.http.get<DocumentEquipment[]>(`${this.apiUrl}/controller/GetAllDocEq`, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }

    addDocumentEquipment(documentEquipment: DocumentEquipment): Observable<DocumentEquipment> {
      console.log('Add Document Equipment Payload:', documentEquipment);
      return this.http.post<DocumentEquipment>(`${this.apiUrl}/controller/AddDocEq`, documentEquipment, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }

    updateDocumentEquipment(id: number, documentEquipment: DocumentEquipment): Observable<void> {
      console.log('Update Document Equipment ID:', id, 'Payload:', documentEquipment);
      return this.http.put<void>(`${this.apiUrl}/controller/UpdateDocEq/${id}`, documentEquipment, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }

    deleteDocumentEquipment(id: number): Observable<void> {
      console.log('Delete Document Equipment ID:', id);
      return this.http.delete<void>(`${this.apiUrl}/controller/DeleteDocEq/${id}`, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError(this.handleError)
      );
    }
    getDocumentSections(): Observable<DocumentSection[]> {
      console.log('Fetching all Document Sections');
      return this.http.get<DocumentSection[]>(`${this.apiUrl}/controller/GetAllDocSections`).pipe(
          catchError(this.handleError)
      );
  }

  addDocumentSection(documentSection: DocumentSection): Observable<DocumentSection> {
      console.log('Add Document Section Payload:', documentSection);
      return this.http.post<DocumentSection>(`${this.apiUrl}/controller/AddDocSection`, documentSection).pipe(
          catchError(this.handleError)
      );
  }

  updateDocumentSection(id: number, documentSection: DocumentSection): Observable<void> {
      console.log('Update Document Section ID:', id, 'Payload:', documentSection);
      return this.http.put<void>(`${this.apiUrl}/controller/UpdateDocSection/${id}`, documentSection).pipe(
          catchError(this.handleError)
      );
  }

  deleteDocumentSection(id: number): Observable<void> {
      console.log('Delete Document Section ID:', id);
      return this.http.delete<void>(`${this.apiUrl}/controller/DeleteDocSection/${id}`).pipe(
          catchError(this.handleError)
      );
  }
  getDocumentTypes(): Observable<DocumentType[]> {
    console.log('Fetching all Document Types');
    return this.http.get<DocumentType[]>(`${this.apiUrl}/controller/GetAllDocTypes`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  addDocumentType(documentType: DocumentType): Observable<DocumentType> {
    console.log('Add Document Type Payload:', documentType);
    return this.http.post<DocumentType>(`${this.apiUrl}/controller/AddDocType`, documentType, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateDocumentType(id: number, documentType: DocumentType): Observable<void> {
    console.log('Update Document Type ID:', id, 'Payload:', documentType);
    return this.http.put<void>(`${this.apiUrl}/controller/UpdateDocType/${id}`, documentType, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteDocumentType(id: number): Observable<void> {
    console.log('Delete Document Type ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/controller/DeleteDocType/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/controller/GetAllCertificates`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  addCertificate(certificate: Certificate): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.apiUrl}/controller/AddCertificate`, certificate, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateCertificate(id: number, certificate: Certificate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/controller/UpdateCertificate/${id}`, certificate, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteCertificate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/controller/DeleteCertificate/${id}`, {
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




