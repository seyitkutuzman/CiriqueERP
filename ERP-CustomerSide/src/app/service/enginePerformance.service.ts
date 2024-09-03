import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuxiliaryEnginePerformanceDaily } from '../models/auxiliaryEnginePerformanceDaily.model';
import { AuxiliaryEnginePerformanceMonthly } from '../models/AuxiliaryEnginePerformanceMonthly.model';

@Injectable({
  providedIn: 'root'
})
export class EnginePerformanceService {
  private apiUrl = 'https://localhost:7071/api';

  constructor(private http: HttpClient) {}

  // Daily Performance CRUD Operations
  getAuxiliaryEnginePerformances(compNo: number, startDate: string, endDate: string): Observable<AuxiliaryEnginePerformanceDaily[]> {
    return this.http.get<AuxiliaryEnginePerformanceDaily[]>(`${this.apiUrl}/AuxiliaryEnginePerformanceDaily/${compNo}?startDate=${startDate}&endDate=${endDate}`);
  }

  getAuxiliaryEnginePerformanceDetail(id: number): Observable<AuxiliaryEnginePerformanceDaily> {
    return this.http.get<AuxiliaryEnginePerformanceDaily>(`${this.apiUrl}/AuxiliaryEnginePerformanceDaily/${id}`);
  }

  updateAuxiliaryEnginePerformance(id: number, performance: AuxiliaryEnginePerformanceDaily): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/AuxiliaryEnginePerformanceDaily/${id}`, performance);
  }

  addAuxiliaryEnginePerformance(performance: AuxiliaryEnginePerformanceDaily): Observable<AuxiliaryEnginePerformanceDaily> {
    return this.http.post<AuxiliaryEnginePerformanceDaily>(`${this.apiUrl}/AuxiliaryEnginePerformanceDaily`, performance);
  }

  deleteAuxiliaryEnginePerformance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/AuxiliaryEnginePerformanceDaily/${id}`);
  }

  // Monthly Performance CRUD Operations
  getAuxiliaryEnginePerformanceMonthly(compNo: number): Observable<AuxiliaryEnginePerformanceMonthly[]> {
    return this.http.get<AuxiliaryEnginePerformanceMonthly[]>(`${this.apiUrl}/AuxiliaryEnginePerformanceMonthly/getAuxiliary/${compNo}`);
  }

  getAuxiliaryEnginePerformanceMonthlyDetail(id: number): Observable<AuxiliaryEnginePerformanceMonthly> {
    return this.http.get<AuxiliaryEnginePerformanceMonthly>(`${this.apiUrl}/AuxiliaryEnginePerformanceMonthly/${id}`);
  }

  updateAuxiliaryEnginePerformanceMonthly(id: number, performance: AuxiliaryEnginePerformanceMonthly): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/AuxiliaryEnginePerformanceMonthly/${id}`, performance);
  }

  addAuxiliaryEnginePerformanceMonthly(performance: AuxiliaryEnginePerformanceMonthly): Observable<AuxiliaryEnginePerformanceMonthly> {
    return this.http.post<AuxiliaryEnginePerformanceMonthly>(`${this.apiUrl}/AuxiliaryEnginePerformanceMonthly`, performance);
  }

  deleteAuxiliaryEnginePerformanceMonthly(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/AuxiliaryEnginePerformanceMonthly/${id}`);
  }
}
