import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../../../service/MainService.service';
import { DocumentType } from '../../../../models/documentType.model';
import { SharedModule } from '../../../../modules/shared.module';
import { MainSidebarComponent } from '../../../layouts/main-sidebar/main-sidebar.component';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  standalone: true,
  imports: [SharedModule, MainSidebarComponent, ReactiveFormsModule],
  styleUrls: ['./document-type.component.css']
})
export class DocumentTypeComponent implements OnInit {
  @ViewChild('content') content: any; // Modal içerik referansı
  documentTypes: DocumentType[] = [];
  documentTypeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private documentTypeService: MainService,
    private modalService: NgbModal
  ) {
    this.documentTypeForm = this.fb.group({
      id: [null],
      documentType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDocumentTypes();
  }

  loadDocumentTypes(): void {
    this.documentTypeService.getDocumentTypes().subscribe(data => {
      this.documentTypes = data;
    });
  }

  onSubmit(): void {
    if (this.documentTypeForm.valid) {
      const documentType: DocumentType = this.documentTypeForm.value;

      if (documentType.id) {
        this.documentTypeService.updateDocumentType(documentType.id!, documentType).subscribe(() => {
          this.loadDocumentTypes();
          this.documentTypeForm.reset();
        });
      } else {
        this.documentTypeService.addDocumentType(documentType).subscribe(() => {
          this.loadDocumentTypes();
          this.documentTypeForm.reset();
        });
      }
    }
  }

  onEdit(documentType: DocumentType): void {
    this.documentTypeForm.patchValue(documentType);
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result === 'Save' && this.documentTypeForm.valid) {
        const updatedDocumentType: DocumentType = this.documentTypeForm.value;
        this.documentTypeService.updateDocumentType(updatedDocumentType.id!, updatedDocumentType).subscribe(() => {
          this.loadDocumentTypes();
        });
      }
      this.documentTypeForm.reset();
    }, (reason) => {
      this.documentTypeForm.reset();
    });
  }

  onDelete(id: number): void {
    this.documentTypeService.deleteDocumentType(id).subscribe(() => {
      this.loadDocumentTypes();
    });
  }
}
