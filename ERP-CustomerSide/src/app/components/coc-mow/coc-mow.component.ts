import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { vesselModel } from '../../models/vesselModel';
import { boUserService } from '../../service/backOfficeUser.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BlankComponent } from '../blank/blank.component';
import { SectionComponent } from '../section/section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-coc-mow',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, BlankComponent, SectionComponent, ReactiveFormsModule],
  templateUrl: './coc-mow.component.html',
  styleUrls: ['./coc-mow.component.css'],
  providers: [DatePipe]
})
export class CocMowComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;
  @ViewChild('editModalContent') editModalContent: any;
  vessels: vesselModel[] = [];
  allVessels: vesselModel[] = [];
  filteredVessels: vesselModel[] = [];
  selectedVessel: vesselModel | null = null;
  vesselForm: FormGroup;
  editVesselForm: FormGroup;
  id: number = 0;
  startDate: string | null = null;
  endDate: string | null = null;
  selectedStatus: number | null = null;
  documentNo: string = ' 01/2024';
  constructor(
    private userService: boUserService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datePipe: DatePipe
  ) {
    this.vesselForm = this.fb.group({
      vesselId: [null],
      vesselName: ['', Validators.required],
      compNo: [0],
      docNo: ['01/2024', Validators.required],
      description: ['', Validators.required],
      human: [false],
      system: [false],
      material: [false],
      subject: ['hull system', Validators.required],
      openedDate: ['', Validators.required],
      dueDate: ['', [Validators.required, this.dateValidator('openedDate')]],
      extendedDate: ['', this.dateValidator('dueDate')],
      closedDate: ['', this.dateValidator('openedDate')],
      remarks: [''],
      status: [0],
      tasks: [0]
    });

    this.editVesselForm = this.fb.group({
      vesselId: [null],
      vesselName: ['', Validators.required],
      compNo: [0],
      docNo: ['01/2024', Validators.required],
      description: ['', Validators.required],
      human: [false],
      system: [false],
      material: [false],
      subject: ['hull system', Validators.required],
      openedDate: ['', Validators.required],
      dueDate: ['', [Validators.required, this.dateValidator('openedDate')]],
      extendedDate: ['', this.dateValidator('dueDate')],
      closedDate: ['', this.dateValidator('openedDate')],
      remarks: [''],
      status: [0],
      tasks: [0]
    });
  }

  ngOnInit(): void {
    this.userService.getVessels().subscribe((response: vesselModel[]) => {
      this.vessels = response.map(vessel => {
        vessel.openedDate = this.datePipe.transform(vessel.openedDate, 'yyyy-MM-dd') || vessel.openedDate;
        vessel.dueDate = vessel.dueDate ? this.datePipe.transform(vessel.dueDate, 'yyyy-MM-dd') || '' : '';
        vessel.extendedDate = vessel.extendedDate ? this.datePipe.transform(vessel.extendedDate, 'yyyy-MM-dd') || '' : '';
        vessel.closedDate = vessel.closedDate ? this.datePipe.transform(vessel.closedDate, 'yyyy-MM-dd') || '' : '';
        if (vessel.extendedDate && new Date(vessel.extendedDate) < new Date()) {
          vessel.status = 2;
        }
        return vessel;
      });
      this.filteredVessels = this.vessels;
    });

    this.userService.getAllVessels().subscribe((response: vesselModel[]) => {
      this.allVessels = response;
      console.log('All Vessels Response:', response);
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
      const currentUser = this.userService.currentUserValue;
      const decodedToken = this.userService.decodeToken(currentUser?.accessToken);
      const compNo = decodedToken?.CompNo;

      this.vesselForm.patchValue({ compNo: compNo });

      const selectedVessel = this.allVessels.find(v => v.vesselName === this.vesselForm.value.vesselName);
      if (selectedVessel) {
        this.vesselForm.patchValue({ vesselName: selectedVessel.vesselName });
      }

      if (!this.vesselForm.value.closedDate) {
        this.vesselForm.patchValue({ closedDate: null });
      }

      console.log('Form Values:', this.vesselForm.value);

      this.userService.createVessel(this.vesselForm.value).subscribe({
        next: (response) => {
          response.openedDate = this.datePipe.transform(response.openedDate, 'yyyy-MM-dd') || response.openedDate;
          response.dueDate = response.dueDate ? this.datePipe.transform(response.dueDate, 'yyyy-MM-dd') || '' : '';
          response.extendedDate = response.extendedDate ? this.datePipe.transform(response.extendedDate, 'yyyy-MM-dd') || '' : '';
          response.closedDate = response.closedDate ? this.datePipe.transform(response.closedDate, 'yyyy-MM-dd') || '' : '';
          if (response.extendedDate && new Date(response.extendedDate) < new Date()) {
            response.status = 2;
          }
          this.vessels.push(response);
          this.filteredVessels.push(response);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating vessel:', error);
        }
      });
    }
  }

  deleteVessel(id: number) {
    console.log('Deleting vessel with ID:', id);

    if (id === undefined || id === null) {
      console.error('Vessel ID is undefined or null');
      return;
    }

    this.userService.deleteVessel(id).subscribe({
      next: () => {
        this.vessels = this.vessels.filter(v => v.id !== id);
        this.filteredVessels = this.filteredVessels.filter(v => v.id !== id);
        console.log('Vessel deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting vessel:', error);
      }
    });
  }

  getStatusText(vessel: vesselModel): string {
    const currentDate = new Date();
    const extendedDate = vessel.extendedDate ? new Date(vessel.extendedDate) : null;

    if (extendedDate && extendedDate < currentDate) {
      return 'Expired';
    }

    switch (vessel.status) {
      case 0:
        return 'Opened';
      case 1:
        return 'Closed';
      case 2:
        return 'Expired';
      default:
        return 'Unknown';
    }
  }

  onVesselChange() {
    this.applyFilters();
  }

  onDateChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredVessels = this.vessels.filter(vessel => {
      const matchVessel = this.selectedVessel ? vessel.vesselName === this.selectedVessel.vesselName : true;
      const matchStatus = this.selectedStatus !== null ? vessel.status === this.selectedStatus : true;
      const matchDate = this.startDate && this.endDate ? new Date(vessel.openedDate) >= new Date(this.startDate) && new Date(vessel.openedDate) <= new Date(this.endDate) : true;
      return matchVessel && matchStatus && matchDate;
    });
  }

  goBack() {
    console.log('Go back clicked');
    // Geri gitme işlemini burada gerçekleştirin
  }

  delete() {
    console.log('Delete clicked');
    // Silme işlemini burada gerçekleştirin
  }

  openEditModal(vessel: vesselModel) {
    this.editVesselForm.patchValue(vessel);
    this.modalService.open(this.editModalContent, { size: 'lg' });
  }

  onEditSubmit() {
    if (this.editVesselForm.valid) {
      this.userService.updateVessel(this.editVesselForm.value).subscribe({
        next: (response) => {
          const index = this.vessels.findIndex(v => v.id === response.id);
          if (index !== -1) {
            this.vessels[index] = response;
            this.filteredVessels[index] = response;
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating vessel:', error);
        }
      });
    }
  }

  dateValidator(compareTo: string) {
    return (formControl: AbstractControl) => {
      if (!formControl.parent) {
        return null;
      }

      const compareDate = formControl.parent.get(compareTo)?.value;
      if (compareDate && formControl.value) {
        const compareDateValue = new Date(compareDate);
        const formControlValue = new Date(formControl.value);

        if (formControlValue < compareDateValue) {
          return { invalidDate: true };
        }
      }

      return null;
    };
  }
}
