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

  constructor(
    private fb: FormBuilder,
    private documentEquipmentService: MainService,
    private modalService: NgbModal
  ) {
    this.documentEquipmentForm = this.fb.group({
      id: [null],
      rootName: ['', Validators.required],
      equipmentName: ['', Validators.required],
      comment: ['']
    });

    this.editDocumentEquipmentForm = this.fb.group({
      id: [null],
      rootName: ['', Validators.required],
      equipmentName: ['', Validators.required],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.loadDocumentEquipments();
  }

  loadDocumentEquipments(): void {
    this.documentEquipmentService.getDocumentEquipments().subscribe(data => {
      this.documentEquipments = data;
      console.log('Fetched Document Equipments:', data);
    }, error => {
      console.error('Error fetching document equipments:', error);
    });
  }

  onSubmit(): void {
    if (this.documentEquipmentForm.valid) {
      const documentEquipment: DocumentEquipment = this.documentEquipmentForm.value;
      console.log('Form Submit Payload:', documentEquipment);

      if (documentEquipment.id) {
        this.documentEquipmentService.updateDocumentEquipment(documentEquipment.id, documentEquipment).subscribe(() => {
          this.loadDocumentEquipments();
          this.documentEquipmentForm.reset();
        }, error => {
          console.error('Error updating document equipment:', error);
        });
      } else {
        this.documentEquipmentService.addDocumentEquipment(documentEquipment).subscribe(() => {
          this.loadDocumentEquipments();
          this.documentEquipmentForm.reset();
        }, error => {
          console.error('Error adding document equipment:', error);
        });
      }
    }
  }

  openEditModal(content: any, documentEquipment: DocumentEquipment): void {
    this.editDocumentEquipmentForm.patchValue(documentEquipment);
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  onEditSubmit(): void {
    if (this.editDocumentEquipmentForm.valid) {
      const documentEquipment: DocumentEquipment = this.editDocumentEquipmentForm.value;
      this.documentEquipmentService.updateDocumentEquipment(documentEquipment.id, documentEquipment).subscribe(() => {
        this.loadDocumentEquipments();
        this.editDocumentEquipmentForm.reset();
        this.modalRef?.close();
      }, error => {
        console.error('Error updating document equipment:', error);
      });
    }
  }

  onDelete(id: number): void {
    this.documentEquipmentService.deleteDocumentEquipment(id).subscribe(() => {
      this.loadDocumentEquipments();
    }, error => {
      console.error('Error deleting document equipment:', error);
    });
  }
}
