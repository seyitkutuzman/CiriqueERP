import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DrydockPlanning } from '../../../../models/DrydockPlanning.model';
import { vesselModel } from '../../../../models/vesselModel';
import { MainService } from '../../../../service/MainService.service';
import { DrydockPlanningService } from '../../../../service/DrydockPlanningService';
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-drydock-planning',
  templateUrl: './drydock-planning.component.html',
  styleUrls: ['./drydock-planning.component.css'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule]
})
export class DrydockPlanningComponent implements OnInit {
  drydockPlannings: DrydockPlanning[] = [];
  vessels: vesselModel[] = [];
  drydockPlanningForm: FormGroup;
  editForm: FormGroup;
  canEdit: boolean = false;
  canAdd: boolean = false;

  constructor(
    private fb: FormBuilder,
    private drydockService: DrydockPlanningService,
    private modalService: NgbModal,
    private mainService: MainService
  ) {
    this.drydockPlanningForm = this.fb.group({
      vesselId: [0, Validators.required],
      shipyardName: ['', Validators.required],
      plannedStartDate: ['', Validators.required],
      plannedEndDate: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      currency: ['', Validators.required],
      comment: [''],
      compNo: [0] // compNo alanı eklendi
    });

    this.editForm = this.fb.group({
      id: [null],
      vesselId: [0, Validators.required],
      shipyardName: ['', Validators.required],
      plannedStartDate: ['', Validators.required],
      plannedEndDate: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      currency: ['', Validators.required],
      comment: [''],
      compNo: [0] // compNo alanı eklendi
    });
  }

  ngOnInit(): void {
    this.checkUserPermissions();
    this.loadDrydockPlannings();
    this.loadVessels();
  }

  checkUserPermissions(): void {
    const currentUser = this.mainService.currentUserValue;
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    const departmentId = decodedToken?.Departmant;

    // Sadece departman 2 veya 3 ise ekleme ve güncelleme izinlerini veririz
    this.canEdit = departmentId === '2' || departmentId === '3';
    this.canAdd = this.canEdit;
  }

  loadDrydockPlannings(): void {
    const compNo = parseInt(localStorage.getItem('compNo') || '0', 10);
    if (compNo > 0) {
      this.drydockService.getDrydockPlannings(compNo).subscribe(data => {
        this.drydockPlannings = data;
      });
    } else {
      console.error('Invalid company number.');
    }
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  onSubmit(): void {
    if (this.canAdd && this.drydockPlanningForm.valid) {
      const compNo = parseInt(localStorage.getItem('compNo') || '0', 10);
      const drydockPlanning: DrydockPlanning = {
        ...this.drydockPlanningForm.value,
        vesselId: Number(this.drydockPlanningForm.value.vesselId),
        compNo: compNo
      };

      this.drydockService.addDrydockPlanning(drydockPlanning).subscribe(() => {
        this.loadDrydockPlannings();
        this.drydockPlanningForm.reset();
      }, error => {
        console.error('Error adding drydock planning:', error);
      });
    } else {
      console.error('Permission denied or form invalid.');
    }
  }

  openEditModal(drydockPlanning: DrydockPlanning, content: any): void {
    if (this.canEdit) {
      this.editForm.patchValue(drydockPlanning);
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
        if (this.editForm.valid) {
          const updatedPlanning = {
            ...this.editForm.value,
            vesselId: Number(this.editForm.value.vesselId),
            compNo: drydockPlanning.compNo
          };
          this.drydockService.updateDrydockPlanning(updatedPlanning.id!, updatedPlanning).subscribe(() => {
            this.loadDrydockPlannings();
          });
        }
      }, () => {
        this.editForm.reset();
      });
    } else {
      console.error('Permission denied.');
    }
  }

  onDelete(id: number): void {
    if (this.canEdit) {
      const compNo = parseInt(localStorage.getItem('compNo') || '0', 10);
      this.drydockService.deleteDrydockPlanning(id, compNo).subscribe(() => {
        this.loadDrydockPlannings();
      });
    } else {
      console.error('Permission denied.');
    }
  }

  onUpdate(modal: any): void {
    if (this.editForm.valid) {
      const updatedPlanning = {
        ...this.editForm.value,
        vesselId: Number(this.editForm.value.vesselId),
        compNo: parseInt(localStorage.getItem('compNo') || '0', 10)
      };
      this.drydockService.updateDrydockPlanning(updatedPlanning.id!, updatedPlanning).subscribe(() => {
        this.loadDrydockPlannings();
        modal.close();
      }, error => {
        console.error('Error updating drydock planning:', error);
      });
    }
  }
  onVesselChange(event: any): void {
    const selectedVesselId = event.target.value;
    console.log('Selected Vessel ID:', selectedVesselId);
    this.drydockPlanningForm.patchValue({ vesselId: selectedVesselId });
  }
  
  
  
  
  

}
