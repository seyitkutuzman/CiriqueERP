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
  newForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private modalService: NgbModal,
    private mainService: MainService
  ) {
    this.jobForm = this.fb.group({
      vessel: ['', Validators.required],
      jobType: ['All'],
      priority: ['All'],
      jobTitle: [''],
      filterRAS: [false],
      filterCE: [false]
    });

    this.editForm = this.fb.group({
      id: [null],
      vessel: ['', Validators.required],
      component: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobCode: ['', Validators.required],
      responsiblePersonnel: ['', Validators.required],
      jobType: ['', Validators.required],
      counterName: ['', Validators.required],
      pmHour: ['', Validators.required],
      jobStart: ['', Validators.required],
      jobOverdue: ['', Validators.required],
      jobProcedures: ['', Validators.required],
      instructionFile: ['', Validators.required],
      rasDocument: ['', Validators.required],
      rasTemplate: ['', Validators.required],
      isRAS: [false],
      visualOnly: [false],
      attachmentRequired: [false],
      ceShutdown: [false],
      jobConstant: ['', Validators.required],
      fileType: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.newForm = this.fb.group({
      vessel: ['', Validators.required],
      component: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobCode: ['', Validators.required],
      responsiblePersonnel: ['', Validators.required],
      jobType: ['', Validators.required],
      counterName: ['', Validators.required],
      pmHour: ['', Validators.required],
      jobStart: ['', Validators.required],
      jobOverdue: ['', Validators.required],
      jobProcedures: ['', Validators.required],
      instructionFile: ['', Validators.required],
      rasDocument: ['', Validators.required],
      rasTemplate: ['', Validators.required],
      isRAS: [false],
      visualOnly: [false],
      attachmentRequired: [false],
      ceShutdown: [false],
      jobConstant: ['', Validators.required],
      fileType: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadVessels();
  }

  loadJobs(): void {
    const compNoString = localStorage.getItem('compNo'); // compNo değeri string olarak alınır
    const compNo = compNoString ? parseInt(compNoString, 10) : null; // String değeri number'a çevrilir

    if (compNo !== null) {
        this.jobService.getJobs(compNo).subscribe(data => {
            this.jobs = data;
            this.filteredJobs = data;
        });
    } else {
        console.error('Company number not found ');
        // Hata durumunda yapılacak işlemler
    }
}


  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
    });
  }

  filterJobs(): void {
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
        matches = matches && !!job.isCE;
      }

      return matches;
    });
  }

  onSubmit(): void {
    this.filterJobs();
  }

  onFilterChange(): void {
    this.filterJobs();
  }

  openEditModal(job: Job, content: any): void {
    this.editForm.patchValue(job);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
      if (this.editForm.valid) {
        this.jobService.updateJob(this.editForm.value.id!, this.editForm.value).subscribe(() => {
          this.loadJobs();
        });
      }
    }, () => {
      this.editForm.reset();
    });
  }

  openNewModal(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onDelete(id: number): void {
    this.jobService.deleteJob(id).subscribe(() => {
      this.loadJobs();
    });
  }

  onUpdate(modal: any): void {
    if (this.editForm.valid) {
        const compNo = localStorage.getItem('compNo');  // Şirket numarasını localStorage'dan al
        const updatedJobData = { ...this.editForm.value, compNo: compNo };  // Form verilerine `compNo` ekle

        this.jobService.updateJob(this.editForm.value.id!, updatedJobData).subscribe(() => {
            this.loadJobs();
            modal.close();
        });
    }
}

onAdd(modal: any): void {
  if (this.newForm.valid) {
      const compNo = localStorage.getItem('compNo');  // Şirket numarasını localStorage'dan al
      const newJobData = { ...this.newForm.value, compNo: compNo };  // Form verilerine `compNo` ekle

      this.jobService.addJob(newJobData).subscribe(() => {
          this.loadJobs();
          modal.close();
      });
  } else {
      console.log("Form is invalid");
      console.log(this.newForm.errors);
      for (const key in this.newForm.controls) {
          if (this.newForm.controls.hasOwnProperty(key)) {
              const controlErrors = this.newForm.get(key)?.errors;
              if (controlErrors != null) {
                  Object.keys(controlErrors).forEach(keyError => {
                      console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                  });
              }
          }
      }
  }
}
  
}
