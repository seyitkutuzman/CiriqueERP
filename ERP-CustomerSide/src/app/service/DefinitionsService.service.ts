import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { vesselModel } from '../models/vesselModel';
import { VesselComponent } from '../models/VesselComponent.model';
import { Job } from '../models/jobs.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'https://localhost:7071/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  
  getJobs(compNo: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/getJobs/${compNo}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addJob(job: Job): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs/addJob`, job, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateJob(id: number, job: Job): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/jobs/updateJob/${id}`, job, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteJob(id: number, compNo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/deleteJob/${id}/${compNo}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  uploadJobFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/jobs/uploadFile`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }
  downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/jobs/downloadFile?fileName=${fileName}`, {
        responseType: 'blob'
    }).pipe(
        catchError(this.handleError)
    );
}


  getVesselComponents(compNo: number): Observable<VesselComponent[]> {
    return this.http.get<VesselComponent[]>(`${this.apiUrl}/vessel-components/getComponents/${compNo}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
  addVesselComponent(vesselComponent: VesselComponent): Observable<VesselComponent> {
    return this.http.post<VesselComponent>(`${this.apiUrl}/vessel-components/addComponent`, vesselComponent, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
  updateVesselComponent(id: number, vesselComponent: VesselComponent): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/vessel-components/updateComponent/${id}`, vesselComponent, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
  deleteVesselComponent(id: number, compNo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vessel-components/deleteComponent/${id}/${compNo}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post(`${this.apiUrl}/vessel-components/uploadFile`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }
  

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
