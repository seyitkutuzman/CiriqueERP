import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FuelOilAnalysis } from '../models/fuelOilAnalysis.model';
import { ServiceReport } from '../models/ServiceReport.model';
import { VesselDocument } from '../models/VesselDocument.model';
import { ClassSurveyStatus } from '../models/ClassSurveyStatus.model';

@Injectable({
  providedIn: 'root'
})
export class TechnService {
  private apiUrl = 'https://localhost:7071/api'; // API URL
    

  constructor(private http: HttpClient) {}

  // Fuel Oil Analyses listesini getirir
  getFuelOilAnalyses(): Observable<FuelOilAnalysis[]> {
    return this.http.get<FuelOilAnalysis[]>(`${this.apiUrl}/FuelOilAnalysis`);
  }

  // Yeni Fuel Oil Analysis oluşturur
  createFuelOilAnalysis(fuelOilAnalysis: FuelOilAnalysis): Observable<FuelOilAnalysis> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<FuelOilAnalysis>(`${this.apiUrl}/FuelOilAnalysis`, fuelOilAnalysis, { headers });
  }

  // Fuel Oil Analysis günceller
  updateFuelOilAnalysis(id: number, fuelOilAnalysis: FuelOilAnalysis): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<void>(`${this.apiUrl}/FuelOilAnalysis/${id}`, fuelOilAnalysis, { headers });
  }

  // Fuel Oil Analysis siler
  deleteFuelOilAnalysis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/FuelOilAnalysis/${id}`);
  }

downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/FuelOilAnalysis/download/${fileName}`, {
        responseType: 'blob'
    });
}


  // Dosya yükler
  uploadFile(id: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/FuelOilAnalysis/upload/${id}`, formData); // ID'yi URL'de kullanarak gönderebiliriz.
  }
// TechnService içinde
// Service Reports listesini getirir
getServiceReports(compNo: number): Observable<ServiceReport[]> {
    return this.http.get<ServiceReport[]>(`${this.apiUrl}/ServiceReports/getServiceReports/${compNo}`);
}

  

  // Yeni Service Report oluşturur
  createServiceReport(serviceReport: ServiceReport): Observable<ServiceReport> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ServiceReport>(`${this.apiUrl}/ServiceReports`, serviceReport, { headers });
  }

  // Service Report günceller
  updateServiceReport(id: number, serviceReport: ServiceReport): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<void>(`${this.apiUrl}/ServiceReports/${id}`, serviceReport, { headers });
  }

  // Service Report siler
  deleteServiceReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ServiceReports/${id}`);
  }

  // Dosya indirir
  downloadServiceFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/ServiceReports/download/${fileName}`, {
      responseType: 'blob'
    });
  }

  // Dosya yükler
  uploadServiceFile(id: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/ServiceReports/upload/${id}`, formData); 
  }

    // Vessel Documents listesini getirir
    getVesselDocuments(compNo: number): Observable<VesselDocument[]> {
        return this.http.get<VesselDocument[]>(`${this.apiUrl}/VesselDocuments/${compNo}`);
      }
    
      // Tek bir Vessel Document getirir
      getVesselDocumentById(id: number): Observable<VesselDocument> {
        return this.http.get<VesselDocument>(`${this.apiUrl}/VesselDocuments/details/${id}`);
      }
    
      // Yeni Vessel Document oluşturur
      createVesselDocument(vesselDocument: VesselDocument): Observable<VesselDocument> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<VesselDocument>(`${this.apiUrl}/VesselDocuments`, vesselDocument, { headers });
      }
    
      // Vessel Document günceller
      updateVesselDocument(id: number, vesselDocument: VesselDocument): Observable<void> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<void>(`${this.apiUrl}/VesselDocuments/${id}`, vesselDocument, { headers });
      }
    
      // Vessel Document siler
      deleteVesselDocument(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/VesselDocuments/${id}`);
      }
    
      // Dosya indirir
      downloadVesselDocumentFile(fileName: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/VesselDocuments/download/${fileName}`, {
          responseType: 'blob'
        });
      }
    
      // Dosya yükler
      uploadVesselDocumentFile(id: number, formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/VesselDocuments/upload/${id}`, formData);
      }
      getClassSurveyStatuses(compNo: number): Observable<ClassSurveyStatus[]> {
        return this.http.get<ClassSurveyStatus[]>(`${this.apiUrl}/ClassSurveyStatus/${compNo}`);
      }
    
      createClassSurveyStatus(classSurveyStatus: ClassSurveyStatus): Observable<ClassSurveyStatus> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<ClassSurveyStatus>(`${this.apiUrl}/ClassSurveyStatus`, classSurveyStatus, { headers });
      }
    
      updateClassSurveyStatus(id: number, classSurveyStatus: ClassSurveyStatus): Observable<void> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<void>(`${this.apiUrl}/ClassSurveyStatus/${id}`, classSurveyStatus, { headers });
      }
    
      deleteClassSurveyStatus(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/ClassSurveyStatus/${id}`);
      }      
    
      downloadClassSurveyFile(fileName: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/ClassSurveyStatus/download/${fileName}`, {
          responseType: 'blob'
        });
      }
    
      uploadClassSurveyFile(id: number, formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/ClassSurveyStatus/upload/${id}`, formData);
      }
      
}
