import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainService } from '../../../../service/MainService.service';
import { DocumentEquipment } from '../../../../models/documentEquipment.model';
import { SharedModule } from '../../../../modules/shared.module';
import { MainSidebarComponent } from '../../../layouts/main-sidebar/main-sidebar.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-equipment',
  templateUrl: './document-equipment.component.html',
  standalone: true,
  imports: [SharedModule, MainSidebarComponent, ReactiveFormsModule],
  styleUrls: ['./document-equipment.component.css']
})
export class DocumentEquipmentComponent implements OnInit {
  documentEquipments: DocumentEquipment[] = [];
  documentEquipmentForm: FormGroup;
  editDocumentEquipmentForm: FormGroup;
  modalRef: NgbModalRef | undefined;
  canEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private documentEquipmentService: MainService,
    private modalService: NgbModal
  ) {
    this.documentEquipmentForm = this.fb.group({
      id: [null],
      rootName: ['', Validators.required],
      equipmentName: ['', Validators.required],
      comment: [''],
      compNo: ['']  // compNo'yu forma ekledik
    });

    this.editDocumentEquipmentForm = this.fb.group({
      id: [null],
      rootName: ['', Validators.required],
      equipmentName: ['', Validators.required],
      comment: [''],
      compNo: ['']  // compNo'yu forma ekledik
    });
  }
  

  ngOnInit(): void {
    const currentUser = this.documentEquipmentService.currentUserValue;
    const decodedToken = this.documentEquipmentService.decodeToken(currentUser?.accessToken);
    const departmentId = decodedToken?.Departmant;
    this.canEdit = departmentId === '2' || departmentId === '3';

    this.loadDocumentEquipments();
  }

  loadDocumentEquipments(): void {
    const currentUser = this.documentEquipmentService.currentUserValue;
    const decodedToken = this.documentEquipmentService.decodeToken(currentUser?.accessToken);
    const compNo = decodedToken?.CompNo;

    if (compNo) {
      this.documentEquipmentService.getDocumentEquipments(compNo).subscribe(data => {
        this.documentEquipments = data;
      }, error => {
        console.error('Error fetching document equipments:', error);
      });
    }
  }

  onSubmit(): void {
    if (this.canEdit) {
      if (this.documentEquipmentForm.valid) {
        const documentEquipment: DocumentEquipment = this.documentEquipmentForm.value;

        if (documentEquipment.id) {
          this.documentEquipmentService.updateDocumentEquipment(documentEquipment.id, documentEquipment, documentEquipment.compNo).subscribe(() => {
            this.loadDocumentEquipments();
            this.documentEquipmentForm.reset();
          }, error => {
            console.error('Error updating document equipment:', error);
          });
        } else {
          this.documentEquipmentService.addDocumentEquipment(documentEquipment, documentEquipment.compNo).subscribe(() => {
            this.loadDocumentEquipments();
            this.documentEquipmentForm.reset();
          }, error => {
            console.error('Error adding document equipment:', error);
          });
        }
      }
    } else {
      console.warn('User does not have permission to add or edit document equipment.');
    }
  }

  openEditModal(content: any, documentEquipment: DocumentEquipment): void {
    if (this.canEdit) {
      this.editDocumentEquipmentForm.patchValue(documentEquipment);
      this.modalRef = this.modalService.open(content, { size: 'lg' });
    } else {
      console.warn('User does not have permission to open edit modal.');
    }
  }

  onEditSubmit(): void {
    if (this.canEdit) {
      if (this.editDocumentEquipmentForm.valid) {
        const documentEquipment: DocumentEquipment = this.editDocumentEquipmentForm.value;
        this.documentEquipmentService.updateDocumentEquipment(documentEquipment.id, documentEquipment, documentEquipment.compNo).subscribe(() => {
          this.loadDocumentEquipments();
          this.editDocumentEquipmentForm.reset();
          this.modalRef?.close();
        }, error => {
          console.error('Error updating document equipment:', error);
        });
      }
    } else {
      console.warn('User does not have permission to edit document equipment.');
    }
  }

  onDelete(id: number): void {
    if (this.canEdit) {
      const currentUser = this.documentEquipmentService.currentUserValue;
      const decodedToken = this.documentEquipmentService.decodeToken(currentUser?.accessToken);
      const compNo = decodedToken?.CompNo;

      this.documentEquipmentService.deleteDocumentEquipment(id, compNo).subscribe(() => {
        this.loadDocumentEquipments();
      }, error => {
        console.error('Error deleting document equipment:', error);
      });
    } else {
      console.warn('User does not have permission to delete document equipment.');
    }
  }
}
