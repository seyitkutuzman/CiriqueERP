import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { MainService } from '../../../../service/MainService.service'; // MainService added
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SharedModule]
})
export class StockInventoryComponent implements OnInit {
  stockInventoryList: any[] = [];
  stockForm: FormGroup;
  compNo: number;
  private apiUrl = 'https://localhost:7071/api/StockInventory';  // Backend URL

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private mainService: MainService // MainService injected
  ) {
    this.stockForm = this.fb.group({
      stockMainGroup: ['', Validators.required],
      vessel: ['', Validators.required],
      catalog: ['', Validators.required],
      stockName: [''],
      stockCode: [''],
      minStockDefined: [false],
      optimumStock: [false],
      quantity: [0, Validators.required],
      minQuantity: [0, Validators.required],
      existingQuantity: [0, Validators.required]
    });

    this.compNo = Number(localStorage.getItem('compNo')) || 0;  // compNo from MainService
  }

  ngOnInit(): void {
    this.loadStockInventory();
  }

  // Fetch stock inventory data
  loadStockInventory(): void {
    const compNo = this.compNo;
    this.http.get<any[]>(`${this.apiUrl}/compNo/${compNo}`).pipe(
      catchError(error => {
        console.error('Error loading stock inventory data:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.stockInventoryList = data;
    });
  }

  // Add or update stock inventory
  saveStock(): void {
    const compNo = this.compNo;
    const formData = { ...this.stockForm.value, compNo };  // Append compNo to form data

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (formData.stockInventoryID) {
      // Update stock inventory
      this.http.put(`${this.apiUrl}/${formData.stockInventoryID}`, formData, { headers })
        .pipe(
          catchError(error => {
            console.error('Error updating stock inventory:', error);
            return of(null);
          })
        ).subscribe(() => {
          alert('Stock inventory updated successfully.');
          this.loadStockInventory();
          this.resetForm();  // Reset form after update
        });
    } else {
      // Add new stock inventory
      this.http.post(this.apiUrl, formData, { headers })
        .pipe(
          catchError(error => {
            console.error('Error adding stock inventory:', error);
            return of(null);
          })
        ).subscribe(() => {
          alert('Stock inventory added successfully.');
          this.loadStockInventory();
          this.resetForm();  // Reset form after adding new stock
        });
    }
  }

  // Edit stock inventory
  editStock(stock: any): void {
    this.stockForm.patchValue(stock);
  }

  // Delete stock inventory
  deleteStock(id: number): void {
    if (confirm('Are you sure you want to delete this stock inventory?')) {
      this.http.delete(`${this.apiUrl}/${id}`).pipe(
        catchError(error => {
          console.error('Error deleting stock inventory:', error);
          return of(null);
        })
      ).subscribe(() => {
        alert('Stock inventory deleted successfully.');
        this.loadStockInventory();
      });
    }
  }

  // Reset the form
  resetForm(): void {
    this.stockForm.reset({
      stockMainGroup: '',
      vessel: '',
      catalog: '',
      stockName: '',
      stockCode: '',
      minStockDefined: false,
      optimumStock: false,
      quantity: 0,
      minQuantity: 0,
      existingQuantity: 0
    });
  }
}
