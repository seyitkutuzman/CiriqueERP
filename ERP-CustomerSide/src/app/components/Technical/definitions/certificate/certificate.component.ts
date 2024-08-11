import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainService } from '../../../../service/MainService.service';
import { Certificate } from '../../../../models/certificate.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../modules/shared.module';
import { MainSidebarComponent } from '../../../layouts/main-sidebar/main-sidebar.component';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  standalone: true,
  imports: [SharedModule, MainSidebarComponent, ReactiveFormsModule],
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  certificates: Certificate[] = [];
  certificateForm: FormGroup;
  editForm: FormGroup;
  closeResult = '';
  canEdit: boolean = false;

  @ViewChild('editModal', { static: true }) editModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private certificateService: MainService,
    private modalService: NgbModal
  ) {
    this.certificateForm = this.fb.group({
      id: [null],
      certificateName: ['', Validators.required],
      certificateNo: ['', Validators.required],
      certificateGroup: ['', Validators.required],
      certificateType: ['', Validators.required],
      department: ['', Validators.required],
      renewal: [0, Validators.required],
      annual: [0, Validators.required],
      intermediate: [0, Validators.required],
      comment: [''],
      compNo: 0
    });

    this.editForm = this.fb.group({
      id: [null],
      certificateName: ['', Validators.required],
      certificateNo: ['', Validators.required],
      certificateGroup: ['', Validators.required],
      certificateType: ['', Validators.required],
      department: ['', Validators.required],
      renewal: [0, Validators.required],
      annual: [0, Validators.required],
      intermediate: [0, Validators.required],
      comment: [''],
      compNo: 0
    });
  }

  ngOnInit(): void {
    const currentUser = this.certificateService.currentUserValue;
    const decodedToken = this.certificateService.decodeToken(currentUser?.accessToken);
    const departmentId = decodedToken?.Departmant;
    this.canEdit = departmentId === '2' || departmentId === '3';

    this.loadCertificates();
  }

  loadCertificates(): void {
    const currentUser = this.certificateService.currentUserValue;
    const decodedToken = this.certificateService.decodeToken(currentUser?.accessToken);
    const compNo = decodedToken?.CompNo;

    this.certificateService.getCertificates(compNo).subscribe(data => {
      this.certificates = data;
    });
  }

  onSubmit(): void {
    if (this.canEdit && this.certificateForm.valid) {
      const certificate: Certificate = this.certificateForm.value;
      const currentUser = this.certificateService.currentUserValue;
      const decodedToken = this.certificateService.decodeToken(currentUser?.accessToken);
      const compNo = decodedToken?.CompNo;

      if (certificate.id) {
        this.certificateService.updateCertificate(certificate.id, certificate, compNo).subscribe(() => {
          this.loadCertificates();
          this.certificateForm.reset();
        });
      } else {
        this.certificateService.addCertificate(certificate, compNo).subscribe(() => {
          this.loadCertificates();
          this.certificateForm.reset();
        });
      }
    }
  }

  onEdit(certificate: Certificate): void {
    if (this.canEdit) {
      this.editForm.patchValue(certificate);
      this.modalService.open(this.editModal).result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
  }

  onUpdate(modal: any): void {
    if (this.canEdit && this.editForm.valid) {
      const certificate: Certificate = this.editForm.value;
      const currentUser = this.certificateService.currentUserValue;
      const decodedToken = this.certificateService.decodeToken(currentUser?.accessToken);
      const compNo = decodedToken?.CompNo;

      if (certificate.id !== undefined) {
        this.certificateService.updateCertificate(certificate.id, certificate, compNo).subscribe(() => {
          this.loadCertificates();
          modal.close();
        });
      } else {
        console.error('ID is undefined');
      }
    }
  }

  onDelete(id: number): void {
    const currentUser = this.certificateService.currentUserValue;
    const decodedToken = this.certificateService.decodeToken(currentUser?.accessToken);
    const compNo = decodedToken?.CompNo;

    if (this.canEdit) {
      this.certificateService.deleteCertificate(id, compNo).subscribe(() => {
        this.loadCertificates();
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
