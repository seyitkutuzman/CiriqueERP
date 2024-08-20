import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuxiliaryEnginePerformanceDaily } from '../models/auxiliaryEnginePerformanceDaily.model';

@Injectable({
  providedIn: 'root'
})
export class EnginePerformanceService {
  private apiUrl = 'https://localhost:7071/api';

  constructor(private http: HttpClient) {}

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
}
