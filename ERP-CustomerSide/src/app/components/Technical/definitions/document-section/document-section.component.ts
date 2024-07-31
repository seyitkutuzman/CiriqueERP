import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../../../service/MainService.service';
import { SharedModule } from '../../../../modules/shared.module';
import { MainSidebarComponent } from '../../../layouts/main-sidebar/main-sidebar.component';
import { DocumentSection } from '../../../../models/DocumentSection.model';

@Component({
  selector: 'app-document-section',
  templateUrl: './document-section.component.html',
  standalone: true,
  imports: [SharedModule, MainSidebarComponent, ReactiveFormsModule],
  styleUrls: ['./document-section.component.css']
})
export class DocumentSectionComponent implements OnInit {
  documentSections: DocumentSection[] = [];
  documentSectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private documentSectionService: MainService,
    private modalService: NgbModal
  ) {
    this.documentSectionForm = this.fb.group({
      id: [null],
      sectionName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDocumentSections();
  }

  loadDocumentSections(): void {
    this.documentSectionService.getDocumentSections().subscribe(data => {
      this.documentSections = data;
    });
  }

  onSubmit(): void {
    if (this.documentSectionForm.valid) {
      const documentSection: DocumentSection = this.documentSectionForm.value;

      if (documentSection.id) {
        this.documentSectionService.updateDocumentSection(documentSection.id, documentSection).subscribe(() => {
          this.loadDocumentSections();
          this.documentSectionForm.reset();
        });
      } else {
        this.documentSectionService.addDocumentSection(documentSection).subscribe(() => {
          this.loadDocumentSections();
          this.documentSectionForm.reset();
        });
      }
    }
  }

  onEdit(documentSection: DocumentSection, content: any): void {
    this.documentSectionForm.patchValue(documentSection);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result === 'Save') {
        if (this.documentSectionForm.valid) {
          const updatedDocumentSection: DocumentSection = this.documentSectionForm.value;
          this.documentSectionService.updateDocumentSection(updatedDocumentSection.id, updatedDocumentSection).subscribe(() => {
            this.loadDocumentSections();
          });
        }
      }
      this.documentSectionForm.reset();
    }, (reason) => {
      this.documentSectionForm.reset();
    });
  }

  onDelete(id: number): void {
    this.documentSectionService.deleteDocumentSection(id).subscribe(() => {
      this.loadDocumentSections();
    });
  }
}
