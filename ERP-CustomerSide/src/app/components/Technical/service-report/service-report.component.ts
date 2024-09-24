// service-reports.component.ts
import { Component, OnInit } from '@angular/core';
import { TechnService } from '../../../service/Techn.service';
import { MainService } from '../../../service/MainService.service';
import { ServiceReport } from '../../../models/ServiceReport.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { saveAs } from 'file-saver';
import { SharedModule } from '../../../modules/shared.module';
import { vesselModel } from '../../../models/vesselModel';

declare var $: any; // jQuery'yi global olarak tanımlayın

@Component({
  selector: 'app-service-reports',
  templateUrl: './service-report.component.html',
  styleUrls: ['./service-report.component.css'],
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule]
})
export class ServiceReportsComponent implements OnInit {
  serviceReports: ServiceReport[] = [];
  vessels: vesselModel[] = []; // Gemi verileri için değişken
  selectedReport: ServiceReport | null = null;
  fileToUpload: File | null = null;
  reportForm: FormGroup;
  isEditMode: boolean = false;
  compNo: number; // Kullanıcının compNo değeri

  constructor(
    private technService: TechnService, 
    private mainService: MainService, 
    private fb: FormBuilder
  ) {
    this.reportForm = this.fb.group({
      vesselName: ['', Validators.required],
      vesselComponent: [''],
      company: [''],
      reportDate: ['', Validators.required],
      description: [''],
      documentFile: ['', Validators.required], // Dosya alanını zorunlu yapıyoruz
      createdBy: ['Admin', Validators.required] // CreatedBy alanı varsayılan olarak 'Admin' veya giriş yapan kullanıcı adı atanmalı
    });

    // Kullanıcının compNo bilgisini local storage'dan alıyoruz
    this.compNo = Number(localStorage.getItem('compNo')) || 0; // Varsayılan olarak 0 veriyoruz, değer yoksa
  }

  ngOnInit(): void {
    this.loadServiceReports();
    this.loadVessels(); // Gemi verilerini yükle
  }

  // Service Reports verilerini yükler
  loadServiceReports(): void {
    if (this.compNo) {
      this.technService.getServiceReports(this.compNo).pipe(
        catchError(error => {
          console.error('Error loading Service Reports', error);
          return of([]);
        })
      ).subscribe(data => {
        this.serviceReports = data;
      });
    }
  }

  // Gemi verilerini yükler
  loadVessels(): void {
    this.mainService.getAllVessels().pipe(
      catchError(error => {
        console.error('Error loading vessels', error);
        return of([]);
      })
    ).subscribe(data => {
      this.vessels = data as vesselModel[];
    });
  }

  // Yeni veya düzenlenmiş Service Report kaydını kaydeder
  onSaveServiceReport(): void {
    const formValues = this.reportForm.value;
    formValues.compNo = this.compNo; // Kullanıcının compNo'sunu ekliyoruz
    console.log('Form Values:', formValues); // Form verilerini kontrol edin
  
    if (this.isEditMode && this.selectedReport) {
      // Update işlemi
      const updatedReport = { ...this.selectedReport, ...formValues };
      this.technService.updateServiceReport(updatedReport.reportID, updatedReport).pipe(
        catchError(error => {
          console.error('Error updating Service Report', error);
          alert('Error updating Service Report');
          return of(null);
        })
      ).subscribe(() => {
        alert('Service Report updated successfully.');
        this.loadServiceReports();
        $('#serviceReportModal').modal('hide');
      });
    } else {
      // Create işlemi
      this.technService.createServiceReport(formValues).pipe(
        catchError(error => {
          console.error('Error saving Service Report', error);
          alert('Error saving Service Report');
          return of(null);
        })
      ).subscribe(() => {
        alert('Service Report saved successfully.');
        this.loadServiceReports();
        $('#serviceReportModal').modal('hide');
      });
    }
  }
  

  // Yeni Service Report eklemek için popup açar
  openNewServiceReportPopup(): void {
    this.reportForm.reset({ createdBy: 'Admin' }); // Varsayılan kullanıcıyı ata
    this.selectedReport = null;
    this.isEditMode = false;
    $('#serviceReportModal').modal('show');
  }

  // Service Report kaydını editlemek için popup açar
  openEditServiceReportPopup(report: ServiceReport): void {
    this.reportForm.patchValue(report);
    this.selectedReport = report;
    this.isEditMode = true;
    $('#serviceReportModal').modal('show');
  }

  // Service Report silme işlemi
  onDeleteServiceReport(id: number): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.technService.deleteServiceReport(id).pipe(
        catchError(error => {
          console.error('Error deleting Service Report', error);
          alert('Error deleting Service Report');
          return of(null);
        })
      ).subscribe(() => {
        alert('Service Report deleted successfully.');
        this.loadServiceReports();
      });
    }
  }

  // Dosya yükleme işlemi
  onUploadFile(id: number): void {
    if (this.fileToUpload) {
      this.technService.uploadServiceFile(id, this.fileToUpload).pipe(
        catchError(error => {
          console.error('Error uploading file', error);
          alert('Error uploading file');
          return of(null);
        })
      ).subscribe(() => {
        alert('File uploaded successfully.');
        this.loadServiceReports();
      });
    }
  }

// Dosya indirir
onDownloadFile(fileName: string): void {
  if (!fileName) {
    alert('No file available to download.');
    return;
  }
  this.technService.downloadServiceFile(fileName).pipe(
    catchError(error => {
      console.error('Error downloading file', error);
      alert('Error downloading file');
      return of(new Blob());
    })
  ).subscribe((blob) => {
    saveAs(blob, fileName);
  });
}



// Dosya seçildiğinde çalışır
onFileChange(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    this.fileToUpload = event.target.files[0];
    if (this.selectedReport) {
      this.selectedReport.documentFile = this.fileToUpload!.name; // Güncellenen dosya adını ayarlayın
    }
    this.reportForm.patchValue({ documentFile: this.fileToUpload!.name }); // Formu güncelle
  }
}

}
