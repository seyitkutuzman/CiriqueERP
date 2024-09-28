import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { MainService } from '../../../../service/MainService.service'; // MainService added
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SharedModule]
})
export class OrderListComponent implements OnInit {
  orderForm: FormGroup;
  orderList: any[] = [];
  ownedVessels: any[] = [];
  compNo: number;
  private apiUrl = 'https://localhost:7071/api/OrderList';  // Backend URL
  isEditMode: boolean = false;
  selectedOrderId: number | null = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private mainService: MainService // MainService injected
  ) {
    this.orderForm = this.fb.group({
      vessel: ['', Validators.required],
      budgetCode: [''],
      firm: ['', Validators.required],
      department: ['', Validators.required],
      directOrderNo: [''],
      referenceNo: [''],
      dateFrom: [''],
      dateTo: [''],
      personnel: ['', Validators.required],
      signedPersonnel: [''],
      currency: ['', Validators.required],  // New field for currency
      status: ['', Validators.required]  // New field for status
    });

    this.compNo = 0;  // Initial compNo set to 0
  }

  ngOnInit(): void {
    this.compNo = this.mainService.getCurrentCompNo();  // Fetch compNo from MainService
    this.loadOwnedVessels();
    this.searchOrders();  // Load initial order list
  }

  // Fetch owned vessels including 'OFFICE'
  loadOwnedVessels(): void {
    this.mainService.getAllVessels().subscribe(
      (vessels) => {
        this.ownedVessels = vessels;
        this.ownedVessels.unshift({ vesselName: 'OFFICE' });  // Add 'OFFICE' as an extra option
      },
      (error) => {
        console.error('Error fetching vessels:', error);
      }
    );
  }

  // Search for orders based on form input
  searchOrders(): void {
    const formData = this.orderForm.value;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get<any[]>(`${this.apiUrl}/compNo/${this.compNo}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching orders:', error);
          return of([]);
        })
      ).subscribe(data => {
        this.orderList = data;
      });
  }

  // Add or update an order
  addOrUpdateOrder(): void {
    const formData = {
      ...this.orderForm.value,
      compNo: this.compNo  // Include compNo in form data
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (this.orderForm.valid) {
      if (this.isEditMode && this.selectedOrderId) {
        // Update order
        this.http.put<any>(`${this.apiUrl}/${this.selectedOrderId}`, formData, { headers })
          .pipe(
            catchError(error => {
              console.error('Error updating order:', error);
              return of(null);
            })
          ).subscribe(response => {
            alert('Order updated successfully.');
            this.isEditMode = false;  // Exit edit mode
            this.selectedOrderId = null;
            this.searchOrders();  // Reload the order list
          });
      } else {
        // Add new order
        this.http.post<any>(this.apiUrl, formData, { headers })
          .pipe(
            catchError(error => {
              console.error('Error adding order:', error);
              return of(null);
            })
          ).subscribe(response => {
            alert('Order added successfully.');
            this.searchOrders();  // Reload the order list
          });
      }
    } else {
      alert('Please fill out all required fields.');
    }
  }

  // Delete order
  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.delete(`${this.apiUrl}/${orderId}`, { headers })
        .pipe(
          catchError(error => {
            console.error('Error deleting order:', error);
            return of(null);
          })
        ).subscribe(() => {
          alert('Order deleted successfully.');
          this.searchOrders();  // Reload the order list
        });
    }
  }

  // Edit order (load order data into the form)
  editOrder(order: any): void {
    this.isEditMode = true;
    this.selectedOrderId = order.orderID;
    this.orderForm.patchValue(order);  // Fill the form with the selected order's data
  }

  // Clear form fields
  resetForm(): void {
    this.orderForm.reset();
    this.isEditMode = false;
    this.selectedOrderId = null;
  }
}
