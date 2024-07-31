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
  imports: [ReactiveFormsModule, FormsModule,CommonModule, SharedModule],
  templateUrl: './vessel-component.component.html',
  styleUrls: ['./vessel-component.component.css']
})
export class VesselComponentComponent implements OnInit {
  vesselComponents: VesselComponent[] = [];
  vessels: any[] = [];
  vesselComponentForm: FormGroup;
  editForm: FormGroup;

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
      hasSparePart: [false]
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
      hasSparePart: [false]
    });
  }

  ngOnInit(): void {
    this.loadVesselComponents();
    this.loadVessels();
  }

  loadVesselComponents(): void {
    this.jobService.getVesselComponents().subscribe(data => {
      this.vesselComponents = data;
    });
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  onSubmit(): void {
    if (this.vesselComponentForm.valid) {
      const vesselComponent: VesselComponent = this.vesselComponentForm.value;
      this.jobService.addVesselComponent(vesselComponent).subscribe(() => {
        this.loadVesselComponents();
        this.vesselComponentForm.reset();
      });
    }
  }

  onEdit(vesselComponent: VesselComponent, content: any): void {
    this.editForm.patchValue(vesselComponent);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
      if (this.editForm.valid) {
        this.jobService.updateVesselComponent(this.editForm.value.id!, this.editForm.value).subscribe(() => {
          this.loadVesselComponents();
        });
      }
    }, () => {
      this.editForm.reset();
    });
  }

  onDelete(id: number): void {
    this.jobService.deleteVesselComponent(id).subscribe(() => {
      this.loadVesselComponents();
    });
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
