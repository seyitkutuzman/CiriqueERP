import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DrydockJob } from '../../../../models/DrydockJob.model';
import { DrydockPlanningService } from '../../../../service/DrydockPlanningService';
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-drydock-jobs',
  templateUrl: './drydock-job.component.html',
  styleUrls: ['./drydock-job.component.css'],
  standalone: true,
  imports: [SharedModule,ReactiveFormsModule]
})
export class DrydockJobsComponent implements OnInit {
  jobs: DrydockJob[] = [];
  jobForm: FormGroup;
  editForm: FormGroup;
  newForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: DrydockPlanningService,
    private modalService: NgbModal
  ) {
    this.jobForm = this.fb.group({
      jobCode: ['', Validators.required],
      jobTitle: ['', Validators.required],
      unitType: ['', Validators.required],
      description: ['']
    });

    this.editForm = this.fb.group({
      id: [null],
      jobCode: ['', Validators.required],
      jobTitle: ['', Validators.required],
      unitType: ['', Validators.required],
      description: ['']
    });

    this.newForm = this.fb.group({
      jobCode: ['', Validators.required],
      jobTitle: ['', Validators.required],
      unitType: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getDrydockJobs().subscribe(data => {
      this.jobs = data;
    });
  }

  openEditModal(job: DrydockJob, content: any): void {
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
  }

  openNewModal(content: any): void {
    this.modalService.open(content);
  }

  onDelete(id: number): void {
    this.jobService.deleteDrydockJob(id).subscribe(() => {
      this.loadJobs();
    });
  }

  onUpdate(modal: any): void {
    if (this.editForm.valid) {
      this.jobService.updateDrydockJob(this.editForm.value.id!, this.editForm.value).subscribe(() => {
        this.loadJobs();
        modal.close();
      });
    }
  }

  onAdd(modal: any): void {
    if (this.newForm.valid) {
      this.jobService.addDrydockJob(this.newForm.value).subscribe(() => {
        this.loadJobs();
        modal.close();
      });
    }
  }
}
