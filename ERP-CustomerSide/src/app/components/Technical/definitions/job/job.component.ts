import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../../../service/DefinitionsService.service';
import { MainService } from '../../../../service/MainService.service';
import { Job } from '../../../../models/jobs.model';
import { vesselModel } from '../../../../models/vesselModel';
import { SharedModule } from '../../../../modules/shared.module';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SharedModule]
})
export class JobComponent implements OnInit {
  jobs: Job[] = [];
  vessels: vesselModel[] = [];
  filterForm: FormGroup;
  jobForm: FormGroup;
  compNo: number | null = null;
  selectedJob: Job | null = null;
  departmentId: any | null = null;
  hasEditPermission: boolean = false;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private modalService: NgbModal,
    private mainService: MainService
  ) {
    this.filterForm = this.fb.group({
      vessel: [''],
      component: [''],
      jobType: ['All'],
      priority: ['All'],
      jobTitle: [''],
      filterRASRequiredJobs: [false],
      filterCEShutdownRequiredJobs: [false],
      filterMajorOverhaulJobs: [false],
      filterExProofJobs: [false],
    });

    this.jobForm = this.fb.group({
      vessel: ['', Validators.required],
      component: ['', Validators.required],
      jobCode: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobType: [''],
      priority: ['', Validators.required],
      description: ['', Validators.required],
      tasks: ['', Validators.required],
      descFile: [''],
      instructionFile: [''],
      ras: [false],
      ce: [false],
      compNo: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadVessels();
    this.setCompNo(); // compNo'yu ayarla
    this.setDepartmentId(); // Departman ID'sini al ve yetkileri belirle
  }

  setCompNo(): void {
    const currentUser = this.mainService.currentUserValue;
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    this.compNo = decodedToken?.CompNo;
    this.jobForm.patchValue({ compNo: this.compNo });
  }

  setDepartmentId(): void {
    const currentUser = this.mainService.currentUserValue;
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    this.departmentId = decodedToken?.Departmant;
    this.hasEditPermission = !(this.departmentId === '1' || this.departmentId === '4' || this.departmentId === '5');
  }

  loadJobs(): void {
    if (this.compNo) {
      this.jobService.getJobs(this.compNo).subscribe((jobs) => {
        this.jobs = jobs.map(job => ({
          ...job,
          descFileUrl: job.descFile ? `https://localhost:7071/uploads/${job.descFile}` : null,
          instructionFileUrl: job.instructionFile ? `https://localhost:7071/uploads/${job.instructionFile}` : null,
        }));
      });
    }
  }

  onDownloadFile(fileUrl: string): void {
    const fileName = fileUrl.split('/').pop(); // Sadece dosya adını almak için
    this.jobService.downloadFile(fileName!).subscribe((blob: Blob) => {
        saveAs(blob, fileName!);
    }, error => {
        console.error('Dosya indirme hatası:', error);
    });
}


  loadVessels(): void {
    this.mainService.getAllVessels().subscribe((vessels) => {
      this.vessels = vessels;
    });
  }

  onSearch(): void {
    const filters = this.filterForm.value;
    this.jobService.getJobs(this.compNo!).subscribe((jobs) => {
      this.jobs = jobs.filter(job => {
        return (!filters.vessel || job.vessel === filters.vessel) &&
               (!filters.component || job.component === filters.component) &&
               (filters.jobType === 'All' || job.jobType === filters.jobType) &&
               (filters.priority === 'All' || job.priority === filters.priority) &&
               (!filters.jobTitle || job.jobTitle.includes(filters.jobTitle));
      });
    });
  }

  openJobModal(content: any): void {
    if (!this.hasEditPermission) {
      alert("You don't have permission to add or edit jobs.");
      return;
    }
    this.selectedJob = null;
    this.jobForm.reset();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onEdit(job: Job, content: any): void {
    if (!this.hasEditPermission) {
      alert("You don't have permission to edit jobs.");
      return;
    }
    this.selectedJob = job;
    this.jobForm.patchValue(job);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveJob(): void {
    if (!this.hasEditPermission) {
      alert("You don't have permission to save jobs.");
      return;
    }

    if (this.jobForm.invalid) {
      return;
    }

    const compNo = this.compNo;

    if (this.selectedJob) {
      this.jobService.updateJob(this.selectedJob.id!, { ...this.jobForm.value, compNo }).subscribe(() => {
        this.loadJobs();
        this.modalService.dismissAll();
      });
    } else {
      const newJob: Job = { ...this.jobForm.value, compNo: this.compNo };
      this.jobService.addJob(newJob).subscribe(() => {
        this.loadJobs();
        this.modalService.dismissAll();
      });
    }
  }

  onDelete(id: number): void {
    if (!this.hasEditPermission) {
      alert("You don't have permission to delete jobs.");
      return;
    }

    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id, this.compNo!).subscribe(() => {
        this.loadJobs();
      });
    }
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.jobService.uploadJobFile(file).subscribe(response => {
        this.jobForm.patchValue({ [field]: response.filePath });
      });
    }
  }
}
