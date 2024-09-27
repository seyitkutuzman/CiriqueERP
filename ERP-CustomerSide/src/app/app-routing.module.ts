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
import { MainEnginePerformanceDailyComponent } from './components/Technical/Engine Performance/main-engine-performance-daily/main-engine-performance-daily.component';
import { MainEnginePerformanceMonthlyComponent } from './components/Technical/Engine Performance/main-engine-performance-monthly/main-engine-performance-monthly.component';
import { FuelOilAnalysisComponent } from './components/Technical/fuel-oil-analysis/fuel-oil-analysis.component';
import { ServiceReportsComponent } from './components/Technical/service-report/service-report.component';
import { VesselDocumentsComponent } from './components/Technical/vessel-document/vessel-document.component';
import { ClassSurveyStatusComponent } from './components/Technical/class-survey-status/class-survey-status.component';
import { StockGeneralComponent } from './components/Purchasing/Definitions/stock-general/stock-general.component';
import { StockInventoryComponent } from './components/Purchasing/Stock Operations/stock-inventory/stock-inventory.component';
import { StockInOutComponent } from './components/Purchasing/Stock Operations/stock-in-out/stock-in-out.component';


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
    {path: 'auxiliaryMonthly', component: AuxiliaryEnginePerformanceMonthlyComponent},
    {path: 'mainEngineDaily', component: MainEnginePerformanceDailyComponent},
    {path: 'mainEngineMonthly', component: MainEnginePerformanceMonthlyComponent},
    {path: 'fuelOilAnalysis', component: FuelOilAnalysisComponent},
    {path: 'serviceReports', component: ServiceReportsComponent},
    {path: 'vesselDocs', component: VesselDocumentsComponent},
    {path: 'classSurvey', component: ClassSurveyStatusComponent},
    {path:'stock', component: StockGeneralComponent},
    {path:'stockInv', component: StockInventoryComponent},
    {path: 'stockInOut', component:StockInOutComponent}
  ] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
