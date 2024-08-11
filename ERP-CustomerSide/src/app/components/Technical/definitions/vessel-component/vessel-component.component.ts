import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VesselComponent } from '../../../../models/VesselComponent.model';
import { MainService } from '../../../../service/MainService.service';
import { JobService } from '../../../../service/DefinitionsService.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-vessel-component',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SharedModule],
  templateUrl: './vessel-component.component.html',
  styleUrls: ['./vessel-component.component.css']
})
export class VesselComponentComponent implements OnInit {
  vesselComponents: VesselComponent[] = [];
  vessels: any[] = [];
  vesselComponentForm: FormGroup;
  editForm: FormGroup;
  canEdit: boolean = false;
  compNo: number | null = null;

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private jobService: JobService,
    private modalService: NgbModal
  ) {
    this.vesselComponentForm = this.fb.group({
      vessel: ['', Validators.required],
      componentName: ['', Validators.required],
      maker: [''],
      model: [''],
      serial: [''],
      priority: ['', Validators.required],
      troubleshootingFile: [''],
      isExProof: [false],
      isClassRelated: [false],
      hasSparePart: [false],
      compNo: [''] // compNo alanını forma ekledik
    });

    this.editForm = this.fb.group({
      id: [null],
      vessel: ['', Validators.required],
      componentName: ['', Validators.required],
      maker: [''],
      model: [''],
      serial: [''],
      priority: ['', Validators.required],
      troubleshootingFile: [''],
      isExProof: [false],
      isClassRelated: [false],
      hasSparePart: [false],
      compNo: [''] // compNo alanını forma ekledik
    });
  }

  ngOnInit(): void {
    this.checkUserPermissions();
    this.loadVesselComponents();
    this.loadVessels();
  }

  checkUserPermissions(): void {
    const currentUser = this.mainService.currentUserValue;
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    const departmentId = decodedToken?.Departmant;
    this.compNo = decodedToken?.CompNo; // compNo'yu token'dan alıyoruz
    this.canEdit = departmentId === '2' || departmentId === '3';
  }

  loadVesselComponents(): void {
    if (this.compNo) {
      this.jobService.getVesselComponents(this.compNo).subscribe(data => {
        this.vesselComponents = data;
      });
    } else {
      console.error('Invalid or missing company number.');
    }
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  onSubmit(): void {
    if (this.canEdit && this.compNo) {
      const vesselComponent: VesselComponent = { ...this.vesselComponentForm.value, compNo: this.compNo };
      this.jobService.addVesselComponent(vesselComponent).subscribe(() => {
        this.loadVesselComponents();
        this.vesselComponentForm.reset();
      });
    } else {
      console.error('Permission denied, form invalid, or company number missing.');
    }
  }

  onEdit(vesselComponent: VesselComponent, content: any): void {
    if (this.canEdit && this.compNo) {
      this.editForm.patchValue(vesselComponent);
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
        if (this.editForm.valid) {
          const updatedComponent: VesselComponent = { ...this.editForm.value, compNo: this.compNo };
          this.jobService.updateVesselComponent(updatedComponent.id!, updatedComponent).subscribe(() => {
            this.loadVesselComponents();
          });
        }
      }, () => {
        this.editForm.reset();
      });
    } else {
      console.error('Permission denied or company number missing.');
    }
  }

  onDelete(id: number): void {
    if (this.canEdit && this.compNo) {
      this.jobService.deleteVesselComponent(id, this.compNo).subscribe(() => {
        this.loadVesselComponents();
      });
    } else {
      console.error('Permission denied or company number missing.');
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.jobService.uploadFile(file).subscribe(response => {
        this.vesselComponentForm.patchValue({ troubleshootingFile: response.filePath });
      });
    }
  }
}
