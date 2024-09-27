import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { MainService } from '../../../../service/MainService.service';  // MainService'ten compNo'yu çekeceğiz
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-stock-in-out',
  templateUrl: './stock-in-out.component.html',
  styleUrls: ['./stock-in-out.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SharedModule]
})
export class StockInOutComponent implements OnInit {
  stockInOutList: any[] = [];
  stockForm: FormGroup;
  isEditMode: boolean = false;
  selectedStock: any | null = null;
  compNo: number;
  private apiUrl = 'https://localhost:7071/api/StockInOut';  // Backend URL'i

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private mainService: MainService // compNo'yu MainService'ten çekiyoruz
  ) {
    this.stockForm = this.fb.group({
      stockMainGroup: ['', Validators.required],
      inOut: ['', Validators.required],
      inOutType: [''],
      quantity: [0, Validators.required],
      date: ['', Validators.required]
    });

    this.compNo = Number(localStorage.getItem('compNo')) || 0;  // compNo'yu localStorage'dan alıyoruz
  }

  ngOnInit(): void {
    this.loadStockInOut();
  }

  // Stok In/Out kayıtlarını yükler
  loadStockInOut(): void {
    const compNo = this.compNo;
    this.http.get<any[]>(`${this.apiUrl}/CompNo/${compNo}`).pipe(
      catchError(error => {
        console.error('Error loading stock in/out data:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.stockInOutList = data;
    });
  }

  // Yeni stok ekler veya günceller
  saveStock(): void {
    const formData = { ...this.stockForm.value, compNo: this.compNo };  // formData'ya compNo ekliyoruz

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (this.isEditMode && this.selectedStock) {
      // Stok güncelleme işlemi
      this.http.put(`${this.apiUrl}/${this.selectedStock.stockInOutID}`, formData, { headers })
        .pipe(
          catchError(error => {
            console.error('Error updating stock in/out:', error);
            return of(null);
          })
        ).subscribe(() => {
          alert('Stock In/Out updated successfully.');
          this.resetForm();
          this.loadStockInOut();
        });
    } else {
      // Yeni stok ekleme işlemi
      this.http.post(this.apiUrl, formData, { headers })
        .pipe(
          catchError(error => {
            console.error('Error adding stock in/out:', error);
            return of(null);
          })
        ).subscribe(() => {
          alert('Stock In/Out added successfully.');
          this.resetForm();
          this.loadStockInOut();
        });
    }
  }

  // Stok düzenleme
  editStock(stock: any): void {
    this.isEditMode = true;
    this.selectedStock = stock;
    this.stockForm.patchValue(stock);
  }

  // Stok silme
  deleteStock(id: number): void {
    if (confirm('Are you sure you want to delete this stock?')) {
      this.http.delete(`${this.apiUrl}/${id}`).pipe(
        catchError(error => {
          console.error('Error deleting stock in/out:', error);
          return of(null);
        })
      ).subscribe(() => {
        alert('Stock In/Out deleted successfully.');
        this.loadStockInOut();
      });
    }
  }

  // Form sıfırlama
  resetForm(): void {
    this.stockForm.reset({
      stockMainGroup: '',
      inOut: '',
      inOutType: '',
      quantity: 0,
      date: ''
    });
    this.isEditMode = false;
    this.selectedStock = null;
  }
}
