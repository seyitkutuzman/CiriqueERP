import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DrydockPlanning } from '../../../../models/DrydockPlanning.model';
import { vesselModel } from '../../../../models/vesselModel';
import { MainService } from '../../../../service/MainService.service';
import { SharedModule } from '../../../../modules/shared.module';
import { CommonModule } from '@angular/common';
import { DrydockPlanningService } from '../../../../service/DrydockPlanningService';

@Component({
  selector: 'app-drydock-planning',
  templateUrl: './drydock-planning.component.html',
  styleUrls: ['./drydock-planning.component.css'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule, CommonModule]
})
export class DrydockPlanningComponent implements OnInit {
  drydockPlannings: DrydockPlanning[] = [];
  vessels: vesselModel[] = [];
  drydockPlanningForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private drydockService: DrydockPlanningService,
    private modalService: NgbModal,
    private mainService: MainService
  ) {
    this.drydockPlanningForm = this.fb.group({
      vesselId: [null, Validators.required],
      shipyardName: ['', Validators.required],
      plannedStartDate: ['', Validators.required],
      plannedEndDate: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      currency: ['', Validators.required],
      comment: ['']
    });

    this.editForm = this.fb.group({
      id: [null],
      vesselId: [null, Validators.required],
      shipyardName: ['', Validators.required],
      plannedStartDate: ['', Validators.required],
      plannedEndDate: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      currency: ['', Validators.required],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.loadDrydockPlannings();
    this.loadVessels();
  }

  loadDrydockPlannings(): void {
    this.drydockService.getDrydockPlannings().subscribe(data => {
      this.drydockPlannings = data;
    });
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  onSubmit(): void {
    if (this.drydockPlanningForm.valid) {
      const drydockPlanning: DrydockPlanning = {
        ...this.drydockPlanningForm.value,
        vesselId: Number(this.drydockPlanningForm.value.vesselId)
      };

      this.drydockService.addDrydockPlanning(drydockPlanning).subscribe(() => {
        this.loadDrydockPlannings();
        this.drydockPlanningForm.reset();
      }, error => {
        console.error('Error adding drydock planning:', error);
      });
    }
  }

  openEditModal(drydockPlanning: DrydockPlanning, content: any): void {
    this.editForm.patchValue(drydockPlanning);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
      if (this.editForm.valid) {
        const updatedPlanning = {
          ...this.editForm.value,
          vesselId: Number(this.editForm.value.vesselId)
        };
        this.drydockService.updateDrydockPlanning(updatedPlanning.id!, updatedPlanning).subscribe(() => {
          this.loadDrydockPlannings();
        });
      }
    }, () => {
      this.editForm.reset();
    });
  }

  onDelete(id: number): void {
    this.drydockService.deleteDrydockPlanning(id).subscribe(() => {
      this.loadDrydockPlannings();
    });
  }

  onUpdate(modal: any): void {
    if (this.editForm.valid) {
      const updatedPlanning = {
        ...this.editForm.value,
        vesselId: Number(this.editForm.value.vesselId)
      };
      this.drydockService.updateDrydockPlanning(updatedPlanning.id!, updatedPlanning).subscribe(() => {
        this.loadDrydockPlannings();
        modal.close();
      });
    }
  }
}
