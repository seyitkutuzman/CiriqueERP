import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipmentCounter } from '../../../../models/equipment-counter.model';
import { vesselModel } from '../../../../models/vesselModel';
import { MainService } from '../../../../service/MainService.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-equipment-counter',
  standalone: true,
  templateUrl: './equipment-counter.component.html',
  styleUrls: ['./equipment-counter.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule]
})
export class EquipmentCounterComponent implements OnInit {
  equipmentCounters: EquipmentCounter[] = [];
  vessels: vesselModel[] = [];
  equipmentCounterForm: FormGroup;
  editForm: FormGroup;
  canEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private modalService: NgbModal
  ) {
    this.equipmentCounterForm = this.fb.group({
      vessel: ['', Validators.required],
      equipmentCounterName: ['', Validators.required],
      compNo: ['']
    });

    this.editForm = this.fb.group({
      id: [null],
      vessel: ['', Validators.required],
      equipmentCounterName: ['', Validators.required],
      compNo: ['']
    });
  }

  ngOnInit(): void {
    this.loadEquipmentCounters();
    this.loadVessels();
    this.checkUserPermissions();
  }

  checkUserPermissions(): void {
    const currentUser = this.mainService.currentUserValue;
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    const departmentId = decodedToken?.Departmant;
    this.canEdit = departmentId === '2' || departmentId === '3';
  }

  loadEquipmentCounters(): void {
    const compNo = parseInt(localStorage.getItem('compNo') || '0', 10);
    if (compNo > 0) {
      this.mainService.getEquipmentCounters(compNo).subscribe(data => {
        this.equipmentCounters = data;
      }, error => {
        console.error('Error fetching equipment counters:', error);
      });
    } else {
      console.error('Invalid company number');
    }
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  onSubmit(): void {
    if (this.canEdit && this.equipmentCounterForm.valid) {
      const compNo = localStorage.getItem('compNo');
      const equipmentCounter: EquipmentCounter = { ...this.equipmentCounterForm.value, compNo };

      this.mainService.addEquipmentCounter(equipmentCounter).subscribe(() => {
        this.loadEquipmentCounters();
        this.equipmentCounterForm.reset();
      });
    } else {
      console.error('Permission denied or form invalid.');
    }
  }

  onEdit(equipmentCounter: EquipmentCounter, content: any): void {
    if (this.canEdit) {
      this.editForm.patchValue(equipmentCounter);
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
        if (this.editForm.valid) {
          const updatedCounter: EquipmentCounter = this.editForm.value;
          const compNo = parseInt(localStorage.getItem('compNo') || '0', 10);
          if (compNo > 0) {
            updatedCounter.compNo = compNo;
            this.mainService.updateEquipmentCounter(updatedCounter.id!, updatedCounter).subscribe(() => {
              this.loadEquipmentCounters();
            });
          } else {
            console.error('Invalid or missing company number');
          }
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
      this.mainService.deleteEquipmentCounter(id!).subscribe(() => {
        this.loadEquipmentCounters();
      });
    } else {
      console.error('Permission denied.');
    }
  }
}
