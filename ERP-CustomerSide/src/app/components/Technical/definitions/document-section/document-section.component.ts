import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainService } from '../../../../service/MainService.service';
import { DocumentSection } from '../../../../models/DocumentSection.model';
import { SharedModule } from '../../../../modules/shared.module';
import { MainSidebarComponent } from '../../../layouts/main-sidebar/main-sidebar.component';

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
    private documentSectionService: MainService
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

  onEdit(documentSection: DocumentSection): void {
    this.documentSectionForm.patchValue(documentSection);
  }

  onDelete(id: number): void {
    this.documentSectionService.deleteDocumentSection(id).subscribe(() => {
      this.loadDocumentSections();
    });
  }
}
