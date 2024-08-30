import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuxiliaryEnginePerformanceDaily } from '../models/auxiliaryEnginePerformanceDaily.model';
import { MainService } from './MainService.service';

@Injectable({
  providedIn: 'root'
})
export class EnginePerformanceService {
  private apiUrl = 'https://localhost:7071/api';

  constructor(private http: HttpClient, private mainService: MainService ) {}

  getAuxiliaryEnginePerformances(): Observable<AuxiliaryEnginePerformanceDaily[]> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser || !currentUser.accessToken) {
        throw new Error("User is not authenticated");
    }
    const decodedToken = this.mainService.decodeToken(currentUser.accessToken);
    const compNo = parseInt(decodedToken?.CompNo, 10); // compNo'yu sayıya dönüştürüyoruz

    if (isNaN(compNo)) {
        throw new Error("Company number is not available");
    }

    return this.http.get<AuxiliaryEnginePerformanceDaily[]>(`${this.apiUrl}/AuxiliaryEnginePerformanceDaily/getAuxiliary/${compNo}`);
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
