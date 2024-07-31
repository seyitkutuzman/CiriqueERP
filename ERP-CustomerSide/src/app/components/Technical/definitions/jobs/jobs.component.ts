import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Job } from '../../../../models/job.model';
import { vesselModel } from '../../../../models/vesselModel';
import { JobService } from '../../../../service/DefinitionsService.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../modules/shared.module';
import { MainService } from '../../../../service/MainService.service';
@Component({
  selector: 'app-jobs',
  standalone: true,
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule]
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  vessels: vesselModel[] = [];
  jobForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private modalService: NgbModal,
    private mainService: MainService
  ) {
    this.jobForm = this.fb.group({
      vessel: [''],
      jobType: ['All'],
      priority: ['All'],
      jobTitle: [''],
      filterRAS: [false],
      filterCE: [false]
    });

    this.editForm = this.fb.group({
      id: [null],
      jobTitle: ['', Validators.required],
      description: ['', Validators.required],
      isRAS: [false],
      isCE: [false]
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadVessels();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(data => {
      this.jobs = data;
      this.filteredJobs = data;
    });
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  onSubmit(): void {
    const { vessel, jobType, priority, jobTitle, filterRAS, filterCE } = this.jobForm.value;

    this.filteredJobs = this.jobs.filter(job => {
      let matches = true;

      if (vessel && vessel !== '') {
        matches = matches && job.vessel === vessel;
      }

      if (jobType && jobType !== 'All') {
        matches = matches && job.jobType === jobType;
      }

      if (priority && priority !== 'All') {
        matches = matches && job.priority === priority;
      }

      if (jobTitle && jobTitle !== '') {
        matches = matches && (job.jobTitle ?? '').toLowerCase().includes(jobTitle.toLowerCase());
      }

      if (filterRAS) {
        matches = matches && !!job.isRAS;
      }

      if (filterCE) {
        matches = matches && (job.isCE || false);
      }

      return matches;
    });
  }

  onFilterChange(): void {
    this.onSubmit();
  }

  openEditModal(job: Job, content: any): void {
    this.editForm.patchValue(job);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
      if (this.editForm.valid) {
        this.jobService.updateJob(this.editForm.value.id!, {
          ...this.editForm.value,
          isRAS: !!this.editForm.value.isRAS,
          isCE: !!this.editForm.value.isCE
        }).subscribe(() => {
          this.loadJobs();
        });
      }
    }, () => {
      this.editForm.reset();
    });
  }

  onDelete(id: number): void {
    this.jobService.deleteJob(id).subscribe(() => {
      this.loadJobs();
    });
  }

  onUpdate(modal: any): void {
    if (this.editForm.valid) {
      this.jobService.updateJob(this.editForm.value.id!, {
        ...this.editForm.value,
        isRAS: !!this.editForm.value.isRAS,
        isCE: !!this.editForm.value.isCE
      }).subscribe(() => {
        this.loadJobs();
        modal.close();
      });
    }
  }
}