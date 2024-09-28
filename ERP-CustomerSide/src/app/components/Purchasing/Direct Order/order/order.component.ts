import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MainService } from '../../../../service/MainService.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { boUserModel } from '../../../../models/User.model'; // User model
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-direct-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule]
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  userName: string = ''; // Kullanıcı adı ve soyadı
  orderList: any[] = [];
  ownedVessels: any[] = [];
  compNo: number = 0; // Şirket numarası
  isEditMode: boolean = false;
  selectedOrder: any | null = null;
  private apiUrl = 'https://localhost:7071/api/Order';  // Backend URL

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private mainService: MainService, // MainService eklendi
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
      personnel: ['', Validators.required], // Kullanıcı adı buraya gelecek
      signedPersonnel: [''],
      currency: ['', Validators.required],
      status: ['', Validators.required],
      compNo: ['']
    });

    this.compNo = this.mainService.getCurrentCompNo(); // compNo'yu mainService'den alıyoruz
  }

  ngOnInit(): void {
    this.loadUserName(); // Kullanıcı adını çekiyoruz
    this.loadOwnedVessels();
    this.searchOrders();
  }

  // Kullanıcı adını mainService ile çekme işlemi
  loadUserName(): void {
    this.mainService.getCurrentUserName().subscribe(userName => {
      this.userName = userName;
      this.orderForm.patchValue({ personnel: this.userName }); // Kullanıcı adı form alanına dolduruluyor
    });
  }

  // Owned Vessels (Gemi bilgileri)
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

  // Siparişleri listele
  searchOrders(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get<any[]>(`${this.apiUrl}/compNo/${this.compNo}`)
      .subscribe(data => {
        this.orderList = data;
      }, error => {
        console.error('Error fetching orders:', error);
      });
  }

  // Yeni sipariş ekleme veya mevcut siparişi düzenleme
  openOrderPopup(content: any, order: any = null): void {
    this.isEditMode = order ? true : false;
    this.selectedOrder = order;

    if (this.isEditMode && this.selectedOrder) {
      this.orderForm.patchValue(this.selectedOrder);
    } else {
      this.orderForm.reset();
      this.orderForm.patchValue({ personnel: this.userName, compNo: this.compNo }); // Kullanıcı adı ve compNo form alanına ekleniyor
    }

    this.modalService.open(content, { size: 'lg' });
  }

  // Siparişi kaydet veya güncelle
  saveOrder(): void {
    const formData = this.orderForm.value;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (this.orderForm.valid) {
      if (this.isEditMode && this.selectedOrder) {
        // Güncelle
        this.http.put<any>(`${this.apiUrl}/${this.selectedOrder.OrderID}`, formData, { headers })
          .subscribe(response => {
            alert('Order updated successfully.');
            this.modalService.dismissAll();
            this.searchOrders();
          }, error => {
            console.error('Error updating order:', error);
          });
      } else {
        // Yeni ekle
        this.http.post<any>(this.apiUrl, formData, { headers })
          .subscribe(response => {
            alert('Order added successfully.');
            this.modalService.dismissAll();
            this.searchOrders();
          }, error => {
            console.error('Error adding order:', error);
          });
      }
    } else {
      alert('Please fill out all required fields.');
    }
  }

  // Sipariş sil
  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.http.delete(`${this.apiUrl}/${orderId}`).subscribe(() => {
        alert('Order deleted successfully.');
        this.searchOrders();
      }, error => {
        console.error('Error deleting order:', error);
      });
    }
  }

  // Modal kapatma
  closeModal(): void {
    this.modalService.dismissAll();
  }
}
