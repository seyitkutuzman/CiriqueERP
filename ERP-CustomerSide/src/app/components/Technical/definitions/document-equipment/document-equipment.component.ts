import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../../../service/MainService.service';
import { DocumentEquipment } from '../../../../models/documentEquipment.model';

@Component({
  selector: 'app-document-equipment',
  templateUrl: './document-equipment.component.html',
  styleUrls: ['./document-equipment.component.css']
})
export class DocumentEquipmentComponent implements OnInit {
  documentEquipments: DocumentEquipment[] = [];
  documentEquipmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private documentEquipmentService: MainService
  ) {
    this.documentEquipmentForm = this.fb.group({
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
    });
  }

  onSubmit(): void {
    if (this.documentEquipmentForm.valid) {
      const documentEquipment: DocumentEquipment = this.documentEquipmentForm.value;

      if (documentEquipment.id) {
        this.documentEquipmentService.updateDocumentEquipment(documentEquipment.id, documentEquipment).subscribe(() => {
          this.loadDocumentEquipments();
          this.documentEquipmentForm.reset();
        });
      } else {
        this.documentEquipmentService.addDocumentEquipment(documentEquipment).subscribe(() => {
          this.loadDocumentEquipments();
          this.documentEquipmentForm.reset();
        });
      }
    }
  }

  onEdit(documentEquipment: DocumentEquipment): void {
    this.documentEquipmentForm.patchValue(documentEquipment);
  }

  onDelete(id: number): void {
    this.documentEquipmentService.deleteDocumentEquipment(id).subscribe(() => {
      this.loadDocumentEquipments();
    });
  }
}
