import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CertificateAndSurvey } from '../models/certificateAndSurvey.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateAndSurveyService {
  private apiUrl = 'https://localhost:7071/api/CertificateAndSurvey'; // API URL'i backend ayarınıza göre güncelleyiniz.

  constructor(private http: HttpClient) {}

  getCertificates(): Observable<CertificateAndSurvey[]> {
    return this.http.get<CertificateAndSurvey[]>(`${this.apiUrl}`);
  }

  getCertificateById(id: number): Observable<CertificateAndSurvey> {
    return this.http.get<CertificateAndSurvey>(`${this.apiUrl}/${id}`);
  }

  createCertificate(certificate: CertificateAndSurvey): Observable<CertificateAndSurvey> {
    return this.http.post<CertificateAndSurvey>(`${this.apiUrl}`, certificate);
  }

  updateCertificate(id: number, certificate: CertificateAndSurvey): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, certificate);
  }

  deleteCertificate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadFile(certificateId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('certificateId', certificateId.toString());

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileId}`, { responseType: 'blob' });
  }
}
