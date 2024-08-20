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
  canEdit: boolean = false;
  compNo: number = 0;

  constructor(
    private fb: FormBuilder,
    private documentSectionService: MainService,
    private modalService: NgbModal
  ) {
    this.documentSectionForm = this.fb.group({
      id: [null],
      sectionName: ['', Validators.required],
      compNo: [''], // compNo'yu forma ekledik
    });
  }

  ngOnInit(): void {
    const currentUser = this.documentSectionService.currentUserValue;
    const decodedToken = this.documentSectionService.decodeToken(currentUser?.accessToken);
    const departmentId = decodedToken?.Departmant;
    this.canEdit = departmentId === '2' || departmentId === '3';
    this.compNo = decodedToken?.CompNo;

    this.loadDocumentSections();
  }

  loadDocumentSections(): void {
    if (this.compNo) {
      this.documentSectionService.getDocumentSections(this.compNo).subscribe(data => {
        this.documentSections = data;
      }, error => {
        console.error('Error fetching document sections:', error);
      });
    }
  }

  onSubmit(): void {
    if (this.canEdit && this.documentSectionForm.valid) {
      const documentSection: DocumentSection = this.documentSectionForm.value;
      documentSection.compNo = this.compNo; // compNo'yu form verisine ekliyoruz

      if (documentSection.id) {
        this.documentSectionService.updateDocumentSection(documentSection.id, documentSection).subscribe(() => {
          this.loadDocumentSections();
          this.documentSectionForm.reset();
        }, error => {
          console.error('Error updating document section:', error);
        });
      } else {
        this.documentSectionService.addDocumentSection(documentSection).subscribe(() => {
          this.loadDocumentSections();
          this.documentSectionForm.reset();
        }, error => {
          console.error('Error adding document section:', error);
        });
      }
    } else if (!this.canEdit) {
      console.warn('User does not have permission to add or edit document sections.');
    }
  }

  onEdit(documentSection: DocumentSection, content: any): void {
    if (this.canEdit) {
      this.documentSectionForm.patchValue(documentSection);
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        if (result === 'Save' && this.documentSectionForm.valid) {
          const updatedDocumentSection: DocumentSection = this.documentSectionForm.value;
          updatedDocumentSection.compNo = this.compNo; // compNo'yu güncellenmiş veriye ekliyoruz

          this.documentSectionService.updateDocumentSection(updatedDocumentSection.id, updatedDocumentSection).subscribe(() => {
            this.loadDocumentSections();
          }, error => {
            console.error('Error updating document section:', error);
          });
        }
        this.documentSectionForm.reset();
      }, (reason) => {
        this.documentSectionForm.reset();
      });
    } else {
      console.warn('User does not have permission to edit document sections.');
    }
  }

  onDelete(id: number): void {
    if (this.canEdit) {
      this.documentSectionService.deleteDocumentSection(id, this.compNo).subscribe(() => {
        this.loadDocumentSections();
      }, error => {
        console.error('Error deleting document section:', error);
      });
    } else {
      console.warn('User does not have permission to delete document sections.');
    }
  }
}
