import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { SharedModule } from '../../../../modules/shared.module';
import { MainService } from '../../../../service/MainService.service';  // To get compNo

@Component({
  selector: 'app-stock-general',
  templateUrl: './stock-general.component.html',
  styleUrls: ['./stock-general.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SharedModule]  // Standalone ve gerekli modüller
})
export class StockGeneralComponent implements OnInit {
  stockGeneralList: any[] = [];
  stockForm: FormGroup;
  isEditMode: boolean = false;
  selectedStock: any | null = null;
  fileToUpload: File | null = null;  // For file upload
  private apiUrl = 'https://localhost:7071/api/StockGeneral';  // Backend URL
  showModal: boolean = false;  // To control modal visibility
  compNo: number;  // Company number
  
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private mainService: MainService  // Inject MainService to get compNo
  ) {
    this.stockForm = this.fb.group({
      stockMainGroup: ['', Validators.required],
      budgetCode: [''],
      stockCode: [''],
      IMPACode: [''],
      itemNo: ['', Validators.required],
      drawingNo: [''],
      stockName: ['', Validators.required],
      stockNameLocal: [''],
      unit: ['', Validators.required],
      hasExpirationDate: [false],
      isMSDS: [false],
      isCritical: [false],
      hasCertificate: [false],
      optimumStock: [false],
      minStock: [''],
      maxStock: [''],
      workingStock: [''],
      comment: [''],
      filePath: [''],  // File path
      imageResizeOption: ['Medium']
    });

    // Fetch compNo from MainService or localStorage
    this.compNo = Number(localStorage.getItem('compNo')) || 0;
  }

  ngOnInit(): void {
    this.loadStockGeneral();
  }

  // Load stock data filtered by compNo
  loadStockGeneral(): void {
    this.http.get<any[]>(`${this.apiUrl}/compNo/${this.compNo}`).pipe(
      catchError(error => {
        console.error('Error loading stock data:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.stockGeneralList = data;
    });
  }

  // Save stock (either create or update)
  saveStock(): void {
    if (this.stockForm.valid) {
      const formData = new FormData();
      Object.keys(this.stockForm.value).forEach(key => {
        formData.append(key, this.stockForm.value[key]);
      });

      formData.append('compNo', this.compNo.toString()); // Append compNo to the form data

      if (this.fileToUpload) {
        formData.append('file', this.fileToUpload);  // Append the uploaded file if available
      }

      const headers = new HttpHeaders();

      if (this.isEditMode && this.selectedStock) {
        // Update the stock record
        this.http.put(`${this.apiUrl}/${this.selectedStock.stockID}`, formData, { headers })
          .pipe(
            catchError(error => {
              console.error('Error updating stock:', error);
              return of(null);
            })
          ).subscribe(() => {
            alert('Stock updated successfully.');
            this.resetForm();
            this.loadStockGeneral();
            this.closeModal();
          });
      } else {
        // Create a new stock record
        this.http.post(this.apiUrl, formData, { headers })
          .pipe(
            catchError(error => {
              console.error('Error adding stock:', error);
              return of(null);
            })
          ).subscribe(() => {
            alert('Stock added successfully.');
            this.resetForm();
            this.loadStockGeneral();
            this.closeModal();
          });
      }
    }
  }

  // Edit stock entry
  openEditPopup(stock: any): void {
    this.isEditMode = true;
    this.selectedStock = stock;
    this.stockForm.patchValue(stock);
    this.openModal();
  }

  // Open new stock form
  openNewStockPopup(): void {
    this.isEditMode = false;
    this.selectedStock = null;
    this.resetForm();
    this.openModal();
  }

  // Delete stock entry
  deleteStock(id: number): void {
    if (confirm('Are you sure you want to delete this stock?')) {
      this.http.delete(`${this.apiUrl}/${id}`)
        .pipe(
          catchError(error => {
            console.error('Error deleting stock:', error);
            return of(null);
          })
        ).subscribe(() => {
          alert('Stock deleted successfully.');
          this.loadStockGeneral();
        });
    }
  }

  // Reset the form and clear edit mode
  resetForm(): void {
    this.stockForm.reset({
      stockMainGroup: '',
      budgetCode: '',
      stockCode: '',
      IMPACode: '',
      itemNo: '',
      drawingNo: '',
      stockName: '',
      stockNameLocal: '',
      unit: '',
      hasExpirationDate: false,
      isMSDS: false,
      isCritical: false,
      hasCertificate: false,
      optimumStock: false,
      minStock: '',
      maxStock: '',
      workingStock: '',
      comment: '',
      filePath: '',
      imageResizeOption: 'Medium'
    });
    this.isEditMode = false;
    this.selectedStock = null;
  }

  // Handle file selection
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
    }
  }

  // Open and close modal
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
