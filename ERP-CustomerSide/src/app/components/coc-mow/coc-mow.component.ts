import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { vesselModel } from '../../models/vesselModel';
import { boUserService } from '../../service/backOfficeUser.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BlankComponent } from '../blank/blank.component';
import { SectionComponent } from '../section/section.component';

@Component({
  selector: 'app-coc-mow',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, BlankComponent, SectionComponent, ReactiveFormsModule],
  templateUrl: './coc-mow.component.html',
  styleUrls: ['./coc-mow.component.css']
})
export class CocMowComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;
  vessels: vesselModel[] = [];
  selectedVessel: vesselModel | null = null;
  vesselForm: FormGroup;

  constructor(
    private userService: boUserService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.vesselForm = this.fb.group({
      vesselName: [''],
      description: [''],
      status: [0],
      docNo: [''],
      tasks: [0],
      openedDate: ['']
    });
  }

  ngOnInit(): void {
    this.userService.getVessels().subscribe((response: vesselModel[]) => {
      this.vessels = response;
      console.log('Vessels:', this.vessels);
    });
  }

  openModal() {
    this.modalService.open(this.modalContent, { size: 'lg' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSubmit() {
    if (this.vesselForm.valid) {
      // Tarih alanını kontrol edip varsayılan bir değer atayın
      if (!this.vesselForm.value.openedDate) {
        this.vesselForm.patchValue({ openedDate: new Date().toISOString() });
      }
      this.userService.createVessel(this.vesselForm.value).subscribe({
        next: (response) => {
          console.log('Vessel created successfully:', response);
          this.vessels.push(response);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating vessel:', error);
        }
      });
    }
  }
  onVesselChange(vessel: vesselModel | null) {
    this.selectedVessel = vessel;
    console.log('Selected Vessel:', this.selectedVessel);
  }
}
