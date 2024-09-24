import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassSurveyStatus } from '../../../models/ClassSurveyStatus.model';
import { TechnService } from '../../../service/Techn.service';
import { MainService } from '../../../service/MainService.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { saveAs } from 'file-saver';
import { vesselModel } from '../../../models/vesselModel';
import { SharedModule } from '../../../modules/shared.module';

declare var $: any;

@Component({
  selector: 'app-class-survey-status',
  templateUrl: './class-survey-status.component.html',
  styleUrls: ['./class-survey-status.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SharedModule]
})
export class ClassSurveyStatusComponent implements OnInit {
  classSurveyStatuses: ClassSurveyStatus[] = [];
  vessels: vesselModel[] = [];
  selectedSurvey: ClassSurveyStatus | null = null;
  surveyForm: FormGroup;
  fileToUpload: File | null = null;
  compNo: number;
  currentUserName: string = '';

  constructor(
    private technService: TechnService,
    private mainService: MainService,
    private fb: FormBuilder
  ) {
    this.surveyForm = this.fb.group({
      vesselName: ['', Validators.required],
      reportedDate: [new Date(), Validators.required],
      description: [''],
      documentPath: [''],
      confirmedPersonnel: ['', Validators.required],
      confirmedDate: [this.formatDate(new Date()), Validators.required],  // Correctly formatted date
      createdBy: [''] // Adding CreatedBy field to the form group
    });

    this.compNo = Number(localStorage.getItem('compNo')) || 0;
  }

  ngOnInit(): void {
    this.loadClassSurveyStatuses();
    this.loadVessels();
    this.getCurrentUserName();
  }

  loadClassSurveyStatuses(): void {
    if (this.compNo) {
      this.technService.getClassSurveyStatuses(this.compNo).pipe(
        catchError(error => {
          console.error('Error loading Class Survey Statuses', error);
          return of([]);
        })
      ).subscribe(data => {
        this.classSurveyStatuses = data;
      });
    }
  }

  loadVessels(): void {
    this.mainService.getAllVessels().pipe(
      catchError(error => {
        console.error('Error loading vessels', error);
        return of([]);
      })
    ).subscribe(data => {
      this.vessels = data as vesselModel[];
    });
  }

  getCurrentUserName(): void {
    this.mainService.getCurrentUserName().pipe(
      catchError(error => {
        console.error('Error getting current user name', error);
        return of('');
      })
    ).subscribe(name => {
      this.currentUserName = name;
      this.surveyForm.patchValue({ 
        confirmedPersonnel: this.currentUserName,
        createdBy: this.currentUserName,
        confirmedDate: this.formatDate(new Date()) // Set today's date in correct format
      });
    });
  }

  onSaveSurvey(): void {
    const formValues = this.surveyForm.value;
    formValues.compNo = this.compNo;
  
    if (this.fileToUpload) {
      formValues.documentPath = this.fileToUpload.name;
    }
  
    if (this.selectedSurvey) {
      // Update operation
      const updatedSurvey = { ...this.selectedSurvey, ...formValues };
      this.technService.updateClassSurveyStatus(updatedSurvey.SurveyID, updatedSurvey).pipe(
        catchError(error => {
          console.error('Error updating Class Survey Status', error);
          alert('Error updating Class Survey Status');
          return of(null);
        })
      ).subscribe(() => {
        if (this.fileToUpload) {
          this.onUploadFile(updatedSurvey.SurveyID);
        } else {
          alert('Class Survey Status updated successfully.');
          this.loadClassSurveyStatuses();
          $('#classSurveyStatusModal').modal('hide');
        }
      });
    } else {
      // Create operation
      this.technService.createClassSurveyStatus(formValues).pipe(
        catchError(error => {
          console.error('Error saving Class Survey Status', error);
          alert('Error saving Class Survey Status');
          return of(null);
        })
      ).subscribe((newSurvey: ClassSurveyStatus | null) => {
        if (newSurvey) {
          if (this.fileToUpload) {
            this.onUploadFile(newSurvey.SurveyID);
          } else {
            alert('Class Survey Status saved successfully.');
            this.loadClassSurveyStatuses();
            $('#classSurveyStatusModal').modal('hide');
          }
        } else {
          alert('Error: Class Survey Status could not be saved.');
        }
      });
    }
  }
  

  openNewSurveyPopup(): void {
    this.surveyForm.reset({ 
      confirmedPersonnel: this.currentUserName,
      confirmedDate: this.formatDate(new Date()), // Set today's date in correct format
      createdBy: this.currentUserName
    });
    this.selectedSurvey = null;
    $('#classSurveyStatusModal').modal('show');
  }

  openEditSurveyPopup(survey: ClassSurveyStatus): void {
    this.surveyForm.patchValue(survey);
    this.selectedSurvey = survey;
    $('#classSurveyStatusModal').modal('show');
  }

  onDeleteSurvey(id: number): void {
    if (confirm('Are you sure you want to delete this survey?')) {
      this.technService.deleteClassSurveyStatus(id).pipe(
        catchError(error => {
          console.error('Error deleting Class Survey Status', error);
          alert('Error deleting Class Survey Status');
          return of(null);
        })
      ).subscribe(() => {
        alert('Class Survey Status deleted successfully.');
        this.loadClassSurveyStatuses();
      });
    }
  }

  onUploadFile(id: number): void {
    if (this.fileToUpload) {
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
  
      console.log('Uploading file:', this.fileToUpload.name);
  
      this.technService.uploadClassSurveyFile(id, formData).pipe(
        catchError(error => {
          console.error('Error uploading file', error);
          alert('Error uploading file');
          return of(null);
        })
      ).subscribe(() => {
        alert('File uploaded successfully.');
        this.loadClassSurveyStatuses();
      });
    } else {
      alert('No file selected.');
    }
  }
  
  

  onDownloadFile(fileName: string): void {
    if (!fileName) {
      alert('No file available to download.');
      return;
    }
    this.technService.downloadClassSurveyFile(fileName).pipe(
      catchError(error => {
        console.error('Error downloading file', error);
        alert('Error downloading file');
        return of(new Blob());
      })
    ).subscribe((blob) => {
      saveAs(blob, fileName);
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
      console.log('File selected:', this.fileToUpload!.name);
    }
  }
  

  // Helper function to format date as yyyy-MM-dd
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
