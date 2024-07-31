import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Job } from '../models/job.model';
import { vesselModel } from '../models/vesselModel';
import { VesselComponent } from '../models/VesselComponent.model';

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

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/getJobs`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addJob(job: Job): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs/addJob`, job, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateJob(id: number, job: Job): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/jobs/updateJob/${id}`, job, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/deleteJob/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getVesselComponents(): Observable<VesselComponent[]> {
    return this.http.get<VesselComponent[]>(`${this.apiUrl}/vessel-components/getComponents`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addVesselComponent(vesselComponent: VesselComponent): Observable<VesselComponent> {
    return this.http.post<VesselComponent>(`${this.apiUrl}/vessel-components/addComponent`, vesselComponent, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateVesselComponent(id: number, vesselComponent: VesselComponent): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/vessel-components/updateComponent/${id}`, vesselComponent, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteVesselComponent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vessel-components/deleteComponent/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/vessel-components/uploadFile`, formData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
