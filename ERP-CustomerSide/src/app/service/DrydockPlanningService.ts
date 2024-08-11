import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DrydockPlanning } from '../models/DrydockPlanning.model';
import { catchError } from 'rxjs/operators';
import { DrydockJob } from '../models/DrydockJob.model';

@Injectable({
  providedIn: 'root'
})
export class DrydockPlanningService {
  private apiUrl = 'https://localhost:7071/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getDrydockPlannings(): Observable<DrydockPlanning[]> {
    return this.http.get<DrydockPlanning[]>(`${this.apiUrl}/drydock-planning/getPlannings`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  addDrydockPlanning(drydockPlanning: DrydockPlanning): Observable<DrydockPlanning> {
    return this.http.post<DrydockPlanning>(`${this.apiUrl}/drydock-planning/addPlanning`, drydockPlanning, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  updateDrydockPlanning(id: number, drydockPlanning: DrydockPlanning): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/drydock-planning/updatePlanning/${id}`, drydockPlanning, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  deleteDrydockPlanning(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/drydock-planning/deletePlanning/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getDrydockJobs(compNo: number): Observable<DrydockJob[]> {
    return this.http.get<DrydockJob[]>(`${this.apiUrl}/drydockjobs/getJobs/${compNo}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  addDrydockJob(drydockJob: DrydockJob): Observable<DrydockJob> {
    return this.http.post<DrydockJob>(`${this.apiUrl}/drydockjobs/addJob`, drydockJob, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  updateDrydockJob(id: number, drydockJob: DrydockJob): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/drydockjobs/updateJob/${id}`, drydockJob, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  deleteDrydockJob(id: number, compNo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/drydockjobs/deleteJob/${id}/${compNo}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

}
