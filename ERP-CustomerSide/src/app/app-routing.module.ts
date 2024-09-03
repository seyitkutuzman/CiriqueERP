import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component'; 
import { LayoutsComponent } from './components/layouts/layouts.component';
import { CocMowComponent } from './components/Technical/coc-mow/coc-mow.component';
import { RegulatoryInformationComponent } from './components/Technical/regulatory/regulatory.component';
import { MemoComponent } from './components/Technical/memo/memo.component';
import { DocumentEquipmentComponent } from './components/Technical/definitions/document-equipment/document-equipment.component';
import { DocumentSectionComponent } from './components/Technical/definitions/document-section/document-section.component';
import { DocumentTypeComponent } from './components/Technical/definitions/document-type/document-type.component';
import { CertificateComponent } from './components/Technical/definitions/certificate/certificate.component';
import { EquipmentCounterComponent } from './components/Technical/definitions/equipment-counter/equipment-counter.component';
import { VesselComponentComponent } from './components/Technical/definitions/vessel-component/vessel-component.component';
import { DrydockPlanningComponent } from './components/Technical/drydock/drydock-planning/drydock-planning.component';
import { DrydockJobsComponent } from './components/Technical/drydock/drydock-job/drydock-jobDefiniton.component';
import { JobComponent } from './components/Technical/definitions/job/job.component';
import { AuxiliaryEnginePerformanceDailyComponent } from './components/Technical/Engine Performance/auxiliary-engine-performance-daily/auxiliary-engine-performance-daily.component';
import { AuxiliaryEnginePerformanceMonthlyComponent } from './components/Technical/Engine Performance/auxiliary-engine-performance-monthly/auxiliary-engine-performance-monthly.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LayoutsComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'coc-mow', component: CocMowComponent },
    {path: 'regulatory', component: RegulatoryInformationComponent},
    {path: 'memo', component: MemoComponent},
    {path: 'docEquip', component: DocumentEquipmentComponent},
    {path: 'docSection', component: DocumentSectionComponent},
    {path: 'docType', component: DocumentTypeComponent},
    {path: 'certificate', component:CertificateComponent},
    {path: 'counter', component:EquipmentCounterComponent},
    {path: 'vesselComponent', component:VesselComponentComponent},
    {path: 'drydock-planning', component:DrydockPlanningComponent},
    {path: 'drydock-job', component:DrydockJobsComponent},
    {path: 'jobs', component:JobComponent},
    {path: 'auxiliaryDaily', component: AuxiliaryEnginePerformanceDailyComponent},
    {path: 'auxiliaryMonthly', component: AuxiliaryEnginePerformanceMonthlyComponent}
  ] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
