import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { vesselModel } from '../../../models/vesselModel';
import { MainService } from '../../../service/MainService.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BlankComponent } from '../../blank/blank.component';
import { SectionComponent } from '../../section/section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { SwalService } from '../../../service/swal.service';

@Component({
  selector: 'app-coc-mow',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, BlankComponent, SectionComponent, ReactiveFormsModule],
  templateUrl: './coc-mow.component.html',
  styleUrls: ['./coc-mow.component.css'],
  providers: [DatePipe]
})
export class CocMowComponent implements OnInit {
  canEdit: boolean = false;
  @ViewChild('modalContent') modalContent: any;
  @ViewChild('editModalContent') editModalContent: any;
  @ViewChild('descriptionModalContent') descriptionModalContent: any;
  vessels: vesselModel[] = [];
  allVessels: vesselModel[] = [];
  filteredVessels: vesselModel[] = [];
  selectedVessel: vesselModel | null = null;
  vesselForm: FormGroup;
  editVesselForm: FormGroup;
  descriptionForm: FormGroup;
  id: number = 0;
  startDate: string | null = null;
  endDate: string | null = null;
  selectedStatus: number | null = null;
  documentNo: string = ' 01/2024';
  selectedDescription: string = '';

  constructor(
    private userService: MainService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private swal: SwalService
  ) {
    this.vesselForm = this.fb.group({
      id: [null], // Yeni kayıt için null veya 0 gönderin
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
      id: [null],
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

    this.descriptionForm = this.fb.group({
      description: ['']
    });
  }

  ngOnInit(): void {
    
    const currentUser = this.userService.currentUserValue;
    const decodedToken = this.userService.decodeToken(currentUser?.accessToken);
    const departmentId = decodedToken?.Departmant;
    this.canEdit = departmentId === '2' || departmentId === '3';
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
    }, (error) => {
      this.swal.callToast('Can not found any Condition of Class', 'error', 3000, false, 'warning');
    });
  }

  canEditOrAdd(): boolean {
    const currentUser = this.userService.currentUserValue;
    const department = currentUser?.department;

    // Department 1, 4, 5 ise false dön, aksi halde true
    return !(department === 1 || department === 4 || department === 5);
  }

  openModal() {
    if (!this.canEditOrAdd()) {
      this.swal.callToast('Yetkiniz Yok', 'Bu işlemi gerçekleştiremezsiniz.', 3000, false, 'error');
      return;
    }
    this.modalService.open(this.modalContent, { size: 'lg' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSubmit() {
    if (!this.canEditOrAdd()) {
      this.swal.callToast('Yetkiniz Yok', 'Bu işlemi gerçekleştiremezsiniz.', 3000, false, 'error');
      return;
    }

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

      const vesselData = this.vesselForm.value;
      vesselData.id = null; // Yeni bir kayıt için ID'yi 0 olarak ayarlayın

      console.log('Form Values:', vesselData);

      this.userService.createVessel(vesselData).subscribe({
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
          window.location.reload();
        },
        error: (error) => {
          console.error('Error creating vessel:', error);
          this.swal.callToast('Error creating vessel', 'error', 3000, false, 'warning');
        }
      });
    }
  }

  deleteVessel(id: number) {
    if (!this.canEditOrAdd()) {
      this.swal.callToast('Yetkiniz Yok', 'Bu işlemi gerçekleştiremezsiniz.', 3000, false, 'error');
      return;
    }

    if (id === undefined || id === null) {
      this.swal.callToast('Error deleting vessel', 'error', 3000, false, 'warning');
      return;
    }

    this.userService.deleteVessel(id).subscribe({
      next: () => {
        this.vessels = this.vessels.filter(v => v.id !== id);
        this.filteredVessels = this.filteredVessels.filter(v => v.id !== id);
        this.swal.callToast('Vessel deleted successfully', 'success', 3000, false);
      },
      error: (error) => {
        this.swal.callToast('Error deleting vessel', 'error', 3000, false, 'warning');
      }
    });
  }

  openViewModal(vessel: vesselModel) {
    this.editVesselForm.patchValue(vessel);
    this.editVesselForm.disable();  // Formu sadece görüntüleme moduna al
    this.modalService.open(this.editModalContent, { size: 'lg' });
  }

  openEditModal(vessel: vesselModel) {
    this.editVesselForm.patchValue(vessel);
    this.editVesselForm.enable();  // Formu düzenleme moduna al
    this.modalService.open(this.editModalContent, { size: 'lg' });
  }

  onEditSubmit() {
    if (this.canEdit && this.editVesselForm.valid) {
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
          this.swal.callToast('Error updating vessel', 'error', 3000, false,'warning');
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

  openDescriptionModal(description: string) {
    this.selectedDescription = description;
    this.descriptionForm.patchValue({ description: description });
    this.modalService.open(this.descriptionModalContent, { size: 'lg' });
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
  getStatusText(vessel: vesselModel): string {
    const currentDate = new Date();
    const extendedDate = vessel.extendedDate ? new Date(vessel.extendedDate) : null;
  
    if (vessel.closedDate) {
      return 'Closed';
    }
  
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
  applyFilters() {
    this.filteredVessels = this.vessels.filter(vessel => {
      if (this.selectedVessel && vessel.vesselName !== this.selectedVessel.vesselName) {
        return false;
      }

      if (this.startDate && new Date(vessel.openedDate) < new Date(this.startDate)) {
        return false;
      }

      if (this.endDate && new Date(vessel.openedDate) > new Date(this.endDate)) {
        return false;
      }

      if (this.selectedStatus !== null && vessel.status !== this.selectedStatus) {
        return false;
      }

      return true;
    });
  }
  
      
  
}
