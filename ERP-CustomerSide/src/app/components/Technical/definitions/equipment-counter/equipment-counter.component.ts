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

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private modalService: NgbModal
  ) {
    this.equipmentCounterForm = this.fb.group({
      vessel: ['', Validators.required],
      equipmentCounterName: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id: [null],
      vessel: ['', Validators.required],
      equipmentCounterName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEquipmentCounters();
    this.loadVessels();
  }

  loadEquipmentCounters(): void {
    this.mainService.getEquipmentCounters().subscribe(data => {
      this.equipmentCounters = data;
    });
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  onSubmit(): void {
    if (this.equipmentCounterForm.valid) {
      const equipmentCounter: EquipmentCounter = this.equipmentCounterForm.value;

      this.mainService.addEquipmentCounter(equipmentCounter).subscribe(() => {
        this.loadEquipmentCounters();
        this.equipmentCounterForm.reset();
      });
    }
  }

  onEdit(equipmentCounter: EquipmentCounter, content: any): void {
    this.editForm.patchValue(equipmentCounter);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
      if (this.editForm.valid) {
        this.mainService.updateEquipmentCounter(this.editForm.value.id!, this.editForm.value).subscribe(() => {
          this.loadEquipmentCounters();
        });
      }
    }, () => {
      this.editForm.reset();
    });
  }

  onDelete(id: number): void {
    this.mainService.deleteEquipmentCounter(id!).subscribe(() => {
      this.loadEquipmentCounters();
    });
  }
}
