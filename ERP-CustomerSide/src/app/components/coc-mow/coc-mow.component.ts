import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { vesselModel } from '../../models/vesselModel';
import { boUserService } from '../../service/backOfficeUser.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BlankComponent } from '../blank/blank.component';
import { SectionComponent } from '../section/section.component';
import { AbstractControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  vessels: vesselModel[] = [];
  allVessels: vesselModel[] = []; // For the popup
  filteredVessels: vesselModel[] = [];
  selectedVessel: vesselModel | null = null;
  vesselForm: FormGroup;
  id: number = 0;
  startDate: string | null = null;
  endDate: string | null = null;

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
      docNo: ['', Validators.required],
      description: ['', Validators.required],
      human: [false],
      system: [false],
      material: [false],
      subject: ['hull system', Validators.required], // Varsayılan değer olarak 'hull system' ayarlandı
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
        if (vessel.extendedDate && new Date(vessel.extendedDate) < new Date()) {
          vessel.status = 2; // Expired
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

      this.vesselForm.patchValue({ compNo: compNo }); // compNo'yu ayarla

      const selectedVessel = this.allVessels.find(v => v.vesselName === this.vesselForm.value.vesselName);
      if (selectedVessel) {
        this.vesselForm.patchValue({ vesselName: selectedVessel.vesselName });
      }

      if (!this.vesselForm.value.closedDate) {
        this.vesselForm.patchValue({ closedDate: null });
      }

      console.log('Form Values:', this.vesselForm.value); // Form değerlerini kontrol edin

      this.userService.createVessel(this.vesselForm.value).subscribe({
        next: (response) => {
          response.openedDate = this.datePipe.transform(response.openedDate, 'yyyy-MM-dd') || response.openedDate;
          if (response.extendedDate && new Date(response.extendedDate) < new Date()) {
            response.status = 2; // Expired
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
    console.log('Deleting vessel with ID:', id);  // ID'nin doğru geçtiğini kontrol edin

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
    if (this.selectedVessel) {
      this.filteredVessels = this.vessels.filter(v => v.vesselName === this.selectedVessel?.vesselName);
    } else {
      this.filteredVessels = this.vessels;
    }
    this.applyDateFilter();
  }

  onDateChange() {
    this.applyDateFilter();
  }

  applyDateFilter() {
    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      this.filteredVessels = this.vessels.filter(v => {
        const openedDate = new Date(v.openedDate);
        return openedDate >= startDate && openedDate <= endDate;
      });
    } else {
      this.filteredVessels = this.vessels;
    }
  }

  goBack() {
    console.log('Go back clicked');
    // Geri gitme işlemini burada gerçekleştirin
  }

  delete() {
    console.log('Delete clicked');
    // Silme işlemini burada gerçekleştirin
  }

  
  
  dateValidator(compareTo: string) {
    return (formControl: AbstractControl) => {
      if (!formControl.parent) {
        return null;
      }
  
      const compareDate = formControl.parent.get(compareTo)?.value;
      const currentDate = formControl.value;
  
      if (!compareDate || !currentDate) {
        return null;
      }
  
      return new Date(currentDate) < new Date(compareDate) ? { dateInvalid: true } : null;
    };
  }
}
