import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { boUserService } from '../../service/backOfficeUser.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BlankComponent } from '../blank/blank.component';
import { SectionComponent } from '../section/section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwalService } from '../../service/swal.service';
import { regulatoryModel } from '../../models/regulatoryModel';
import { vesselModel } from '../../models/vesselModel';

@Component({
  selector: 'app-regulatory-information',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, BlankComponent, SectionComponent, ReactiveFormsModule],
  templateUrl: './regulatory.component.html',
  styleUrls: ['./regulatory.component.css'],
  providers: [DatePipe]
})
export class RegulatoryInformationComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;
  vessels: string[] = [];
  regulatoryInfo: regulatoryModel[] = [];
  filteredRegulatoryInfo: regulatoryModel[] = [];
  filterExpiredData: boolean = false;
  regulatoryForm: FormGroup;
  selectedRegulatory: regulatoryModel | null = null;

  constructor(
    private userService: boUserService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private swal: SwalService
  ) {
    this.regulatoryForm = this.fb.group({
      id: [null],
      vessel: ['', Validators.required],
      className: ['', Validators.required],
      description: ['', Validators.required],
      dueBy: ['', Validators.required],
      implementedDate: ['']
    });
  }

  ngOnInit(): void {
    this.userService.getAllVessels().subscribe((response: vesselModel[]) => {
      this.vessels = response.map(vessel => vessel.vesselName);
    });

    this.loadRegulatoryInfo();
  }

  loadRegulatoryInfo() {
    this.userService.getRegulatoryInfo().subscribe((response: regulatoryModel[]) => {
      this.regulatoryInfo = response.map(info => ({
        ...info,
        dueBy: info.dueBy ? new Date(info.dueBy) : null,
        implementedDate: info.implementedDate ? new Date(info.implementedDate) : null
      }));
      this.applyFilter();
    });
  }

  applyFilter() {
    if (this.filterExpiredData) {
      this.filteredRegulatoryInfo = this.regulatoryInfo.filter(info => info.dueBy && new Date(info.dueBy) >= new Date());
    } else {
      this.filteredRegulatoryInfo = this.regulatoryInfo;
    }
  }

  openModal(content: any, regulatory?: regulatoryModel) {
    if (regulatory) {
      this.selectedRegulatory = regulatory;
      this.regulatoryForm.patchValue({
        ...regulatory,
        dueBy: regulatory.dueBy ? this.datePipe.transform(regulatory.dueBy, 'yyyy-MM-dd') : '',
        implementedDate: regulatory.implementedDate ? this.datePipe.transform(regulatory.implementedDate, 'yyyy-MM-dd') : ''
      });
    } else {
      this.selectedRegulatory = null;
      this.regulatoryForm.reset();
    }
    this.modalService.open(content, { size: 'lg' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSubmit() {
    if (this.regulatoryForm.valid) {
      if (this.selectedRegulatory) {
        this.updateRegulatory();
      } else {
        this.addRegulatoryInfo();
      }
    }
  }

  addRegulatoryInfo() {
    const formData = {
      ...this.regulatoryForm.value,
      dueBy: this.regulatoryForm.value.dueBy ? new Date(this.regulatoryForm.value.dueBy) : null,
      implementedDate: this.regulatoryForm.value.implementedDate ? new Date(this.regulatoryForm.value.implementedDate) : null
    };

    this.userService.createRegulatoryInfo(formData).subscribe({
      next: (response) => {
        this.regulatoryInfo.push(response);
        this.applyFilter();
        this.regulatoryForm.reset();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating regulatory info:', error);
      }
    });
  }

  updateRegulatory() {
    const updatedData = {
      ...this.regulatoryForm.value,
      dueBy: this.regulatoryForm.value.dueBy ? new Date(this.regulatoryForm.value.dueBy) : null,
      implementedDate: this.regulatoryForm.value.implementedDate ? new Date(this.regulatoryForm.value.implementedDate) : null
    };

    this.userService.updateRegulatoryInfo(updatedData).subscribe({
      next: (response) => {
        const index = this.regulatoryInfo.findIndex(info => info.id === response.id);
        if (index !== -1) {
          this.regulatoryInfo[index] = response;
          this.applyFilter();
        }
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating regulatory info:', error);
      }
    });
  }

  editInfo(info: regulatoryModel) {
    this.selectedRegulatory = info;
    this.regulatoryForm.patchValue({
      ...info,
      dueBy: info.dueBy ? this.datePipe.transform(info.dueBy, 'yyyy-MM-dd') : '',
      implementedDate: info.implementedDate ? this.datePipe.transform(info.implementedDate, 'yyyy-MM-dd') : ''
    });
    this.modalService.open(this.modalContent, { size: 'lg' });
  }

  deleteInfo(id: number) {
    this.userService.deleteRegulatoryInfo(id).subscribe({
      next: () => {
        this.regulatoryInfo = this.regulatoryInfo.filter(info => info.id !== id);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error deleting regulatory info:', error);
      }
    });
  }
}
