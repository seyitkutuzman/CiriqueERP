import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DrydockJob } from '../../../../models/DrydockJob.model';
import { DrydockPlanningService } from '../../../../service/DrydockPlanningService';
import { SharedModule } from '../../../../modules/shared.module';
import { MainService } from '../../../../service/MainService.service';

@Component({
  selector: 'app-drydock-jobs',
  templateUrl: './drydock-job.component.html',
  styleUrls: ['./drydock-job.component.css'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule]
})
export class DrydockJobsComponent implements OnInit {
  jobs: DrydockJob[] = [];
  jobForm: FormGroup;
  editForm: FormGroup;
  newForm: FormGroup;
  canEdit: boolean = false;
  canAdd: boolean = false;

  constructor(
    private fb: FormBuilder,
    private jobService: DrydockPlanningService,
    private modalService: NgbModal,
    private mainService: MainService
  ) {
    this.jobForm = this.fb.group({
      jobCode: ['', Validators.required],
      jobTitle: ['', Validators.required],
      unitType: ['', Validators.required],
      description: [''],
      compNo: [localStorage.getItem('compNo')],  // compNo ekleniyor
    });

    this.editForm = this.fb.group({
      id: [null],
      jobCode: ['', Validators.required],
      jobTitle: ['', Validators.required],
      unitType: ['', Validators.required],
      description: [''],
      compNo: [localStorage.getItem('compNo')],  // compNo ekleniyor
    });

    this.newForm = this.fb.group({
      jobCode: ['', Validators.required],
      jobTitle: ['', Validators.required],
      unitType: ['', Validators.required],
      description: [''],
      compNo: [localStorage.getItem('compNo')],  // compNo ekleniyor
    });
  }

  ngOnInit(): void {
    this.checkUserPermissions();
    this.loadJobs();
  }

  checkUserPermissions(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    const departmentId = decodedToken?.Departmant;

    // Sadece departman 2 veya 3 ise ekleme ve güncelleme izinlerini veririz
    this.canEdit = departmentId === '2' || departmentId === '3';
    this.canAdd = this.canEdit;  // canAdd de aynı kontrolü kullanır
  }

  loadJobs(): void {
    const compNo = parseInt(localStorage.getItem('compNo') || '0', 10);
    this.jobService.getDrydockJobs(compNo).subscribe(data => {
      this.jobs = data;
    });
  }

  openEditModal(job: DrydockJob, content: any): void {
    if (this.canEdit) {
      this.editForm.patchValue(job);
      this.modalService.open(content).result.then(() => {
        if (this.editForm.valid) {
          this.jobService.updateDrydockJob(this.editForm.value.id!, this.editForm.value).subscribe(() => {
            this.loadJobs();
          });
        }
      }, () => {
        this.editForm.reset();
      });
    } else {
      console.error('Permission denied.');
    }
  }

  openNewModal(content: any): void {
    if (this.canAdd) {
      this.modalService.open(content);
    } else {
      console.error('Permission denied.');
    }
  }

  onDelete(id: number): void {
    if (this.canEdit) {
      const compNo = parseInt(localStorage.getItem('compNo') || '0', 10); // compNo'yu localStorage'dan çekiyoruz
      if (compNo > 0) {
        this.jobService.deleteDrydockJob(id, compNo).subscribe(() => {
          this.loadJobs();
        });
      } else {
        console.error('Invalid or missing company number.');
      }
    } else {
      console.error('Permission denied.');
    }
  }

  onUpdate(modal: any): void {
    if (this.canEdit) {
      console.log('Updated Form Data:', this.editForm.value);
      this.jobService.updateDrydockJob(this.editForm.value.id!, this.editForm.value).subscribe(() => {
        this.loadJobs();
        modal.close();
      }, error => {
        console.error('Error updating job:', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }
  

  onAdd(modal: any): void {
    if (this.canAdd) {
      console.log('Form Data:', this.newForm.value);
      this.jobService.addDrydockJob(this.newForm.value).subscribe(() => {
        this.loadJobs();
        modal.close();
      }, error => {
        console.error('Error adding job:', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }
  
}
