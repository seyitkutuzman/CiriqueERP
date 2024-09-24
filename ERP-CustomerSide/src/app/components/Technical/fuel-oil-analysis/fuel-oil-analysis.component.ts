import { Component, OnInit } from '@angular/core';
import { TechnService } from '../../../service/Techn.service';
import { MainService } from '../../../service/MainService.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuelOilAnalysis } from '../../../models/fuelOilAnalysis.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SharedModule } from '../../../modules/shared.module';
import { vesselModel } from '../../../models/vesselModel';
import { saveAs } from 'file-saver';

declare var $: any; // jQuery'yi global olarak tanımlayın

@Component({
  selector: 'app-fuel-oil-analysis',
  templateUrl: './fuel-oil-analysis.component.html',
  styleUrls: ['./fuel-oil-analysis.component.css'],
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule]
})
export class FuelOilAnalysisComponent implements OnInit {
  fuelOilAnalyses: FuelOilAnalysis[] = [];
  vessels: vesselModel[] = [];
  selectedFuelOilAnalysis: FuelOilAnalysis | null = null;
  fileToUpload: File | null = null; // Dosya yükleme için değişken
  departmentsAllowedToEdit = [2, 3]; // Sadece departman ID'leri 2 ve 3 olanlar kayıt ekleyebilir/güncelleyebilir

  constructor(private technService: TechnService, private mainService: MainService) {}

  ngOnInit(): void {
    this.loadFuelOilAnalyses();
    this.loadVessels();
  }

  // Fuel Oil Analysis verilerini yükler
  loadFuelOilAnalyses(): void {
    this.technService.getFuelOilAnalyses().pipe(
      catchError(error => {
        console.error('Error loading Fuel Oil Analyses', error);
        return of([]);
      })
    ).subscribe(data => {
      this.fuelOilAnalyses = data;
    });
  }

  // Vessel listesi yükler
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

  // Yeni Fuel Oil Analysis kaydı için popup açar
  openNewFuelOilAnalysisPopup(): void {
    this.selectedFuelOilAnalysis = {
      id: 0,
      vesselName: '',
      date: new Date(),
      supplier: '',
      bargeTerminal: '',
      port: '',
      bunkerType: 'Fuel Oil',
      quantity: 0,
      viscosity: 0,
      density: 0,
      status: 'Normal',
      sampleSentDate: new Date(),
      sampleReceivedDate: new Date(),
      firmName: '',
      samplingMethod: '',
      samplePointType: '',
      sealNumberSupplier: '',
      sealNumberLab: '',
      sealNumberVessel: '',
      sealNumberMarpol: '',
      companyComments: '',
      reportNumber: '',
      documentFile: '',
      createdBy: '',
      createdDate: new Date(),
      updatedDate: undefined
    };
    this.fileToUpload = null; // Yeni kayıt için önceki dosya seçimini temizler
    $('#fuelOilAnalysisPopup').modal('show'); // Popup'ı açar
  }

  // Fuel Oil Analysis kaydını editlemek için popup açar
  openEditFuelOilAnalysisPopup(analysis: FuelOilAnalysis): void {
    this.selectedFuelOilAnalysis = { ...analysis };
    this.fileToUpload = null; // Düzenleme sırasında dosya seçimini temizler
    $('#fuelOilAnalysisPopup').modal('show'); // Popup'ı açar
  }

  // Yeni veya düzenlenmiş Fuel Oil Analysis kaydını kaydeder
  onSaveNewFuelOilAnalysis(): void {
    if (this.selectedFuelOilAnalysis) {
      this.technService.createFuelOilAnalysis(this.selectedFuelOilAnalysis).pipe(
        catchError(error => {
          console.error('Error saving Fuel Oil Analysis', error);
          alert('Error saving Fuel Oil Analysis');
          return of(null);
        })
      ).subscribe(() => {
        alert('Fuel Oil Analysis saved successfully.');
        this.loadFuelOilAnalyses(); // Listeleri günceller
        $('#fuelOilAnalysisPopup').modal('hide'); // Popup'ı kapatır
        // Eğer dosya seçilmişse yükleme işlemini başlatır
        if (this.fileToUpload) {
          this.onUploadFile(this.selectedFuelOilAnalysis?.id || 0); // Yeni kaydın ID'si ile dosyayı yükler
        }
      });
    }
  }

onUploadFile(id: number): void {
  if (this.fileToUpload) {
    this.technService.uploadFile(id, this.fileToUpload).pipe(
      catchError(error => {
        console.error('Error uploading file', error);
        alert('Error uploading file');
        return of(null);
      })
    ).subscribe(() => {
      alert('File uploaded successfully.');
      this.loadFuelOilAnalyses(); // Yüklenen dosyayı günceller
    });
  }
}


onDownloadFile(fileName: string): void {
  if (!fileName) {
      alert('No file available to download.');
      return;
  }
  this.technService.downloadFile(fileName).pipe(
      catchError(error => {
          console.error('Error downloading file', error);
          alert('Error downloading file');
          return of(null);
      })
  ).subscribe(blob => {
      if (blob) {
          saveAs(blob, fileName);
      }
  });
}


  // Dosya seçildiğinde çalışır
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
      if (this.selectedFuelOilAnalysis) {
        this.selectedFuelOilAnalysis.documentFile = this.fileToUpload!.name; // Sadece dosya adını kaydediyoruz, backend'e göndermek için uygun işlemi gerçekleştirin.
      }
    }
  }

  // Kullanıcının departman kontrolü
  isUserAllowedToEdit(): boolean {
    const userDepartmentId = this.getDepartmentIdFromUser(); // Kullanıcının departman ID'sini alacak bir metod oluşturun
    return this.departmentsAllowedToEdit.includes(userDepartmentId);
  }

  // Kullanıcının departman ID'sini alacak metod
  private getDepartmentIdFromUser(): number {
    // Kullanıcı departman bilgisini token veya kullanıcı servisinden alabilirsiniz
    const decodedToken = localStorage.getItem('decodedToken');
    const department = decodedToken ? JSON.parse(decodedToken).Departmant : 0;
    return department;
  }
}
