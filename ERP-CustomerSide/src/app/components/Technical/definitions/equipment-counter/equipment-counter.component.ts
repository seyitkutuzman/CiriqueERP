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
      equipmentCounterName: ['', Validators.required],
      compNo: [''] // compNo alanı eklendi
    });

    this.editForm = this.fb.group({
      id: [null],
      vessel: ['', Validators.required],
      equipmentCounterName: ['', Validators.required],
      compNo: [''] // compNo alanı eklendi
    });
  }

  ngOnInit(): void {
    this.loadEquipmentCounters();
    this.loadVessels();
  }

  loadEquipmentCounters(): void {
    const compNo = parseInt(localStorage.getItem('compNo') || '0', 10); // compNo'yu localStorage'dan çekip integer'a çevir
    if (compNo > 0) {
      this.mainService.getEquipmentCounters(compNo).subscribe(data => {
        this.equipmentCounters = data;
      }, error => {
        console.error('Error fetching equipment counters:', error);
      });
    } else {
      console.error('Invalid company number');
      // İsteğe bağlı olarak kullanıcıya bir hata mesajı gösterebilirsiniz.
    }
  }
  

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  onSubmit(): void {
    if (this.equipmentCounterForm.valid) {
      const compNo = localStorage.getItem('compNo'); // compNo'yu localStorage'dan al
      const equipmentCounter: EquipmentCounter = { ...this.equipmentCounterForm.value, compNo };

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
        const updatedCounter: EquipmentCounter = this.editForm.value;
  
        // compNo'yu güvenli bir şekilde sayıya çevirme
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
  }
  

  onDelete(id: number): void {
    this.mainService.deleteEquipmentCounter(id!).subscribe(() => {
      this.loadEquipmentCounters();
    });
  }
}
