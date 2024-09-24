import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VesselDocument } from '../../../models/VesselDocument.model';
import { TechnService } from '../../../service/Techn.service';
import { MainService } from '../../../service/MainService.service';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { saveAs } from 'file-saver';
import { SharedModule } from '../../../modules/shared.module';
import { vesselModel } from '../../../models/vesselModel';

declare var $: any; // jQuery'yi global olarak tanımlayın

@Component({
  selector: 'app-vessel-documents',
  templateUrl: './vessel-document.component.html',
  styleUrls: ['./vessel-document.component.css'],
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule]
})
export class VesselDocumentsComponent implements OnInit {
  vesselDocuments: VesselDocument[] = [];
  vessels: vesselModel[] = []; // Gemi verileri için liste
  selectedDocument: VesselDocument | null = null;
  documentForm: FormGroup;
  fileToUpload: File | null = null;
  isEditMode: boolean = false;
  compNo: number;

  constructor(
    private technService: TechnService,
    private mainService: MainService,
    private fb: FormBuilder
  ) {
    this.documentForm = this.fb.group({
      vesselName: ['', Validators.required],
      documentType: ['', Validators.required],
      sectionName: ['', Validators.required],
      equipment: [''],
      bookName: ['', Validators.required],
      description: [''],
      createdBy: ['Admin', Validators.required] // Varsayılan kullanıcıyı Admin yapabilirsiniz veya giriş yapan kullanıcıyı atayın
    });

    this.compNo = Number(localStorage.getItem('compNo')) || 0; // compNo değerini localStorage'dan alır
  }

  ngOnInit(): void {
    this.loadVesselDocuments();
    this.loadVessels(); // Gemileri yükle
  }

  // Vessel Documents verilerini yükler
  loadVesselDocuments(): void {
    if (this.compNo) {
      this.technService.getVesselDocuments(this.compNo).pipe(
        catchError(error => {
          console.error('Error loading Vessel Documents', error);
          return of([]);
        })
      ).subscribe(data => {
        this.vesselDocuments = data;
      });
    }
  }

  // Gemileri yükler
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

  onSaveDocument(): void {
    const formValues = this.documentForm.value;
    formValues.compNo = this.compNo;
  
    // Provide a default value for FilePath
    formValues.filePath = this.fileToUpload ? this.fileToUpload.name : '';
    if (this.isEditMode && this.selectedDocument) {
      // Update operation
      const updatedDocument = { ...this.selectedDocument, ...formValues };
      this.technService.updateVesselDocument(updatedDocument.documentID, updatedDocument).pipe(
        catchError(error => {
          console.error('Error updating Vessel Document', error);
          alert('Error updating Vessel Document');
          return throwError(error); // Rethrow the error
        })
      ).subscribe({
        next: () => {
          if (this.fileToUpload) {
            this.onUploadFile(updatedDocument.documentID);
          } else {
            alert('Vessel Document updated successfully.');
            this.loadVesselDocuments();
            $('#vesselDocumentModal').modal('hide');
          }
        },
        error: (error) => {
          // Handle the error if needed
          console.error('Subscription error:', error);
        }
      });
    } else {
      // Create operation
      this.technService.createVesselDocument(formValues).pipe(
        catchError(error => {
          console.error('Error saving Vessel Document', error);
          alert('Error saving Vessel Document');
          return throwError(error); // Rethrow the error
        })
      ).subscribe({
        next: (newDocument: VesselDocument) => {
          if (this.fileToUpload) {
            this.onUploadFile(newDocument.documentID);
          } else {
            alert('Vessel Document saved successfully.');
            this.loadVesselDocuments();
            $('#vesselDocumentModal').modal('hide');
          }
        },
        error: (error) => {
          // Handle the error if needed
          console.error('Subscription error:', error);
        }
      });
    }
  }
  


  // Yeni Vessel Document eklemek için popup açar
  openNewDocumentPopup(): void {
    this.documentForm.reset({ createdBy: 'Admin' });
    this.selectedDocument = null;
    this.isEditMode = false;
    $('#vesselDocumentModal').modal('show');
  }

  // Vessel Document kaydını editlemek için popup açar
  openEditDocumentPopup(document: VesselDocument): void {
    this.documentForm.patchValue(document);
    this.selectedDocument = document;
    this.isEditMode = true;
    $('#vesselDocumentModal').modal('show');
  }

  // Vessel Document silme işlemi
  onDeleteDocument(id: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.technService.deleteVesselDocument(id).pipe(
        catchError(error => {
          console.error('Error deleting Vessel Document', error);
          alert('Error deleting Vessel Document');
          return of(null);
        })
      ).subscribe(() => {
        alert('Vessel Document deleted successfully.');
        this.loadVesselDocuments();
      });
    }
  }

  onUploadFile(id: number): void {
    console.log('onUploadFile called with id:', id);
  
    if (this.fileToUpload) {
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
  
      this.technService.uploadVesselDocumentFile(id, formData).pipe(
        catchError(error => {
          console.error('Error uploading file', error);
          alert('Error uploading file');
          return of(null);
        })
      ).subscribe(() => {
        alert('File uploaded successfully.');
        this.loadVesselDocuments();
        $('#vesselDocumentModal').modal('hide');
      });
    } else {
      alert('No file selected.');
    }
  }
  
  
  
  
  
  onDownloadFile(filePath: string): void {
    if (!filePath) {
      alert('No file available to download.');
      return;
    }
  
    // Extract the file name from the file path
    const fileName = filePath.split('/').pop();
  
    if (!fileName) {
      alert('Invalid file path.');
      return;
    }
  
    this.technService.downloadVesselDocumentFile(fileName).pipe(
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
    const filePath = this.fileToUpload!.name; // Dosya adını al
    
    // FilePath alanını formda güncelle
    this.documentForm.patchValue({ filePath: filePath });
  }
}

}
