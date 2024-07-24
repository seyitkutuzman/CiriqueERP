import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    private modalService: NgbModal
  ) {
    this.vesselForm = this.fb.group({
      vesselId: [null],
      vesselName: [''],
      compNo: [0],
      docNo: [''],
      description: [''],
      human: [false],
      system: [false],
      material: [false],
      subject: [''],
      openedDate: [''],
      dueDate: [''],
      extendedDate: [''],
      closedDate: [''],
      remarks: [''],
      status: [0],
      tasks: [0]
    });
  }

  ngOnInit(): void {
    this.userService.getVessels().subscribe((response: vesselModel[]) => {
      this.vessels = response;
      this.filteredVessels = response;
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

      console.log('Form Values:', this.vesselForm.value); // Form değerlerini kontrol edin

      this.userService.createVessel(this.vesselForm.value).subscribe({
        next: (response) => {
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

  getStatusText(status: number): string {
    switch (status) {
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
}
