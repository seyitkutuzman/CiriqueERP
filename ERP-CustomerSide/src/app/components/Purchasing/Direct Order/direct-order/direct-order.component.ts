  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { catchError, of } from 'rxjs';
  import { MainService } from '../../../../service/MainService.service';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { SharedModule } from '../../../../modules/shared.module';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-direct-order',
    templateUrl: './direct-order.component.html',
    styleUrls: ['./direct-order.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, CommonModule, SharedModule]
  })
  export class DirectOrderComponent implements OnInit {
    orderForm: FormGroup;
    orderList: any[] = [];
    ownedVessels: any[] = [];
    compNo: number;
    isEditMode: boolean = false;
    selectedOrder: any | null = null;
    private apiUrl = 'https://localhost:7071/api/DirectOrder';  // Backend URL

    constructor(
      private http: HttpClient,
      private fb: FormBuilder,
      private mainService: MainService,
      private modalService: NgbModal
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
        currency: ['', Validators.required],
        status: ['', Validators.required]
      });

      this.compNo = Number(localStorage.getItem('compNo')) || 0;
    }

    ngOnInit(): void {
      this.loadOwnedVessels();
      this.searchOrders();
    }

    // Fetch owned vessels
    loadOwnedVessels(): void {
      this.mainService.getAllVessels().subscribe(
        (vessels) => {
          this.ownedVessels = vessels;
          this.ownedVessels.unshift({ vesselName: 'OFFICE' });
        },
        (error) => {
          console.error('Error fetching vessels:', error);
        }
      );
    }

    // Search for orders
    searchOrders(): void {
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

    openOrderPopup(content: any, order: any = null): void {
      this.isEditMode = order ? true : false;
      this.selectedOrder = order;
    
      if (this.isEditMode && this.selectedOrder) {
        // Formu seçili order verileri ile doldur
        this.orderForm.patchValue(this.selectedOrder);
      } else {
        // Yeni order için formu sıfırla
        this.orderForm.reset();
      }
    
      // Modal'ı aç
      this.modalService.open(content, { size: 'lg' });
    }
    

    // Save or update order
    saveOrder(): void {
      const formData = this.orderForm.value;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      if (this.orderForm.valid) {
        if (this.isEditMode && this.selectedOrder) {
          // Update existing order
          this.http.put<any>(`${this.apiUrl}/${this.selectedOrder.orderID}`, formData, { headers })
            .pipe(
              catchError(error => {
                console.error('Error updating order:', error);
                return of(null);
              })
            ).subscribe(response => {
              alert('Order updated successfully.');
              this.modalService.dismissAll();  // Close modal
              this.searchOrders();  // Reload the order list
            });
        } else {
          // Add new order
          this.http.post<any>(`${this.apiUrl}`, formData, { headers })
            .pipe(
              catchError(error => {
                console.error('Error adding order:', error);
                return of(null);
              })
            ).subscribe(response => {
              alert('Order added successfully.');
              this.modalService.dismissAll();  // Close modal
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

    // Close the modal
    closeModal(): void {
      this.modalService.dismissAll();
    }
  }
