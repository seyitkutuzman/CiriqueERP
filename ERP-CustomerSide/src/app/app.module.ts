import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ReactiveFormsModule'ü ekleyin
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './service/jwt.interceptor';
import { MainService } from './service/MainService.service';
import { CocMowComponent } from './components/Technical/coc-mow/coc-mow.component';
import { RegulatoryInformationComponent } from './components/regulatory/regulatory.component';
import { DocumentEquipmentComponent } from './components/Technical/definitions/document-equipment/document-equipment.component';
import { DocumentSectionComponent } from './components/Technical/definitions/document-section/document-section.component';
import { DocumentTypeComponent } from './components/Technical/definitions/document-type/document-type.component';
import { CertificateComponent } from './components/Technical/definitions/certificate/certificate.component';
import { JobsComponent } from './components/Technical/definitions/jobs/jobs.component';
import { VesselComponentComponent } from './components/Technical/definitions/vessel-component/vessel-component.component';
import { DrydockPlanningComponent } from './components/Technical/drydock/drydock-planning/drydock-planning.component';
import { DrydockJobsComponent } from './components/Technical/drydock/drydock-job/drydock-job.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, // ReactiveFormsModule'ü burada ekleyin
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AppComponent,
    LoginComponent,
    CocMowComponent,
    RegulatoryInformationComponent,
    DocumentEquipmentComponent, 
    DocumentSectionComponent,
    DocumentTypeComponent,
    CertificateComponent,
    JobsComponent,
    VesselComponentComponent, DrydockPlanningComponent, DrydockJobsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    MainService
  ],
  bootstrap: []
})
export class AppModule { }
