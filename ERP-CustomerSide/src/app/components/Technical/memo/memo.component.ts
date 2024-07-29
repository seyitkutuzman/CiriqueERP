import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../../service/MainService.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BlankComponent } from '../../blank/blank.component';
import { SectionComponent } from '../../section/section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { SwalService } from '../../../service/swal.service';
import { mownerModel } from '../../../models/mownerModel';

@Component({
  selector: 'app-memo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, BlankComponent, SectionComponent, ReactiveFormsModule],
  templateUrl: './memo.component.html',
  styleUrl: './memo.component.css',
  providers: [DatePipe]
})
export class MemoComponent implements OnInit {
  
  @ViewChild('modalContent') modalContent: any;
  @ViewChild('editModalContent') editModalContent: any;
  @ViewChild('descriptionModalContent') descriptionModalContent: any;
  vessels: mownerModel[] = [];
  allVessels: mownerModel[] = [];
  filteredVessels: mownerModel[] = [];
  selectedVessel: mownerModel | null = null;
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
      id: [null], // ID alanını buraya ekliyoruz
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
      id: [null], // ID alanını buraya ekliyoruz
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
    this.userService.getMemos().subscribe((response: mownerModel[]) => {
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

    this.userService.getAllVessels().subscribe((response: mownerModel[]) => {
      this.allVessels = response;
      console.log('All Vessels Response:', response);
    }, (error) => {
      this.swal.callToast('Can not found any Condition of Class', 'error', 3000, false,'warning');
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

      this.userService.createMemo(this.vesselForm.value).subscribe({
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
          this.swal.callToast('Error creating record', 'error', 3000, false,'warning');
        }
      });
    }
  }

  deleteMemo(id: number) {
    if (id === undefined || id === null) {
      this.swal.callToast('Error deleting record', 'error', 3000, false,'warning');
      return;
    }

    this.userService.deleteMemo(id).subscribe({
      next: () => {
        this.vessels = this.vessels.filter(v => v.id !== id);
        this.filteredVessels = this.filteredVessels.filter(v => v.id !== id);
        this.swal.callToast('Vessel deleted successfully', 'success', 3000, false);
      },
      error: (error) => {
        this.swal.callToast('Error deleting vessel', 'error', 3000, false,'warning');
      }
    });
  }

  getStatusText(vessel: mownerModel): string {
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

  openEditModal(vessel: mownerModel) {
    console.log('Vessel to edit:', vessel);  // Konsolda vessel objesini kontrol edin
    this.editVesselForm.patchValue({
      id: vessel.id,  // ID alanını buraya ekliyoruz
      vesselName: vessel.vesselName,
      compNo: vessel.compNo,
      docNo: vessel.docNo,
      description: vessel.description,
      human: vessel.human,
      system: vessel.system,
      material: vessel.material,
      subject: vessel.subject,
      openedDate: vessel.openedDate,
      dueDate: vessel.dueDate,
      extendedDate: vessel.extendedDate,
      closedDate: vessel.closedDate,
      remarks: vessel.remarks,
      status: vessel.status,
      tasks: vessel.tasks
    });
    this.modalService.open(this.editModalContent, { size: 'lg' });
  }

  onEditSubmit() {
    if (this.editVesselForm.valid) {
      const updatedVessel = this.editVesselForm.value;
      console.log('Updated Vessel:', updatedVessel);  // Bu satırla formun içeriğini kontrol edin
      this.userService.updateMemo(updatedVessel).subscribe({
        next: (response) => {
          const index = this.vessels.findIndex(v => v.id === response.id);
          if (index !== -1) {
            this.vessels[index] = response;
            this.filteredVessels[index] = response;
          }
          this.closeModal();
        },
        error: (error) => {
          this.swal.callToast('Error updating record', 'error', 3000, false, 'warning');
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

}
