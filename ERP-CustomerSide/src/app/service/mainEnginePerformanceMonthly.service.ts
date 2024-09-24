// enginePerformance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainEnginePerformanceMonthly } from '../models/mainEnginePerformanceMonthly.model';
import { MainService } from './MainService.service';

@Injectable({
  providedIn: 'root'
})
export class EnginePerformanceService {
  private apiUrl = 'https://localhost:7071/api';

  constructor(private http: HttpClient, private mainService: MainService) {}

  // Methods specifically for MainEnginePerformanceMonthly
  getMainEnginePerformances(compNo: number): Observable<MainEnginePerformanceMonthly[]> {
    return this.http.get<MainEnginePerformanceMonthly[]>(`${this.apiUrl}/mainEnginePerformanceMonthly/get/${compNo}`);
  }

  updateMainEnginePerformance(id: number, performance: MainEnginePerformanceMonthly): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mainEnginePerformanceMonthly/${id}`, performance);
  }

  addMainEnginePerformance(performance: MainEnginePerformanceMonthly): Observable<MainEnginePerformanceMonthly> {
    return this.http.post<MainEnginePerformanceMonthly>(`${this.apiUrl}/mainEnginePerformanceMonthly/addPerformance`, performance);
  }

  deleteMainEnginePerformance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/mainEnginePerformanceMonthly/${id}`);
  }
}
