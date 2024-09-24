// main-engine-performance-monthly.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MainEnginePerformanceMonthly } from '../../../../models/mainEnginePerformanceMonthly.model';
import { vesselModel } from '../../../../models/vesselModel';
import { EnginePerformanceService } from '../../../../service/mainEnginePerformanceMonthly.service';
import { MainService } from '../../../../service/MainService.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-main-engine-performance-monthly',
  templateUrl: './main-engine-performance-monthly.component.html',
  styleUrls: ['./main-engine-performance-monthly.component.css'],
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule]
})
export class MainEnginePerformanceMonthlyComponent implements OnInit {
  performances: MainEnginePerformanceMonthly[] = [];
  ownedVessels: vesselModel[] = [];
  selectedPerformance: MainEnginePerformanceMonthly | null = null;
  isPopupVisible = false;
  performanceForm: FormGroup;
  cylinderCount: number = 6; // Default number of cylinders

  // Define the fields for technical data and cylinder data
  technicalDataFields = [
    { label: 'Cylinder Constant (rpm)', controlName: 'cylinderConstantRpm' },
    { label: 'Speed (rpm)', controlName: 'speedRpm' },
    { label: 'Present Speed', controlName: 'presentSpeed' },
    { label: 'Total Running Hours', controlName: 'totalRunningHours' },
    { label: 'Propeller Pitch (mm)', controlName: 'propellerPitch' },
    { label: 'Theoretical Ship Speed', controlName: 'theoreticalShipSpeed' },
    { label: 'Vessel Condition', controlName: 'vesselCondition' },
    { label: 'Sea', controlName: 'sea' },
    { label: 'Engine Room Temp.', controlName: 'engineRoomTemp' },
    { label: 'S.W. Temperature', controlName: 'sW_Temperature' },
    { label: 'Draft FW/AFT', controlName: 'draft_FW_AFT' },
    { label: 'Displacement', controlName: 'displacement' },
    { label: 'Wind/Wind Direction', controlName: 'windWindDirection' },
    { label: 'Actual Ship Speed', controlName: 'actualShipSpeed' },
    { label: 'Ship Slip', controlName: 'shipSlip' },
    { label: 'Ship Route', controlName: 'shipRoute' },
    { label: 'Fuel Level', controlName: 'fuelLevel' },
    { label: 'Governor Speed', controlName: 'governorSpeed' },
    { label: 'Speed Setting', controlName: 'speedSetting' },
    { label: 'Average Speed M/E', controlName: 'averageSpeedME' },
    { label: 'Average Speed T/C', controlName: 'averageSpeedTC' },
    { label: 'Fuel Cons. During', controlName: 'fuelConsDuring' },
    { label: 'Fuel Density 15°C', controlName: 'fuelDensity' },
    { label: 'Fuel Viscosity', controlName: 'fuelViscosity' },
    { label: 'Fuel Eng. Inlet Temp', controlName: 'fuelEngInletTemp' },
    { label: 'Engine KW', controlName: 'engineKW' },
  ];

  cylinderFields = [
    { label: 'PMax (bar)', controlName: 'pMax' },
    { label: 'PComp (bar)', controlName: 'pComp' },
    { label: 'Exh. Gas Temp (°C)', controlName: 'exhGasTemp' },
    { label: 'F. Pump Rack Ind', controlName: 'fPumpRackInd' },
    { label: 'VET', controlName: 'vet' },
  ];

  constructor(
    private fb: FormBuilder,
    private enginePerformanceService: EnginePerformanceService,
    private mainService: MainService
  ) {
    this.performanceForm = this.fb.group({
      vesselName: ['', Validators.required],
      formDate: ['', Validators.required],
      personnel: ['', Validators.required],
      engineNo: [1, Validators.required],
      cylinderConstantRpm: [0],
      speedRpm: [0],
      presentSpeed: [0],
      totalRunningHours: [0],
      propellerPitch: [0],
      theoreticalShipSpeed: [0],
      vesselCondition: [''],
      sea: [0],
      engineRoomTemp: [0],
      sW_Temperature: [0],
      draft_FW_AFT: [0],
      displacement: [0],
      windWindDirection: [0],
      actualShipSpeed: [0],
      shipSlip: [0],
      shipRoute: [''],
      fuelLevel: [0],
      governorSpeed: [0],
      speedSetting: [0],
      averageSpeedME: [0],
      averageSpeedTC: [0],
      fuelConsDuring: [0],
      fuelDensity: [0],
      fuelViscosity: [0],
      fuelEngInletTemp: [0],
      meanScavAirPress: [0],
      changeAirTempBefore: [0],
      changeAirTempAfter: [0],
      engineLoad: [0],
      tCExhInletTemp: [0],
      tCExhOutletTemp: [0],
      cylCoolingWaterTemp: [0],
      cylCoolingWaterPress: [0],
      cylLuboilTemp: [0],
      cylLuboilPress: [0],
      oilConsTonsPerDay: [0],
      engineKW: [0],
      compNo: [parseInt(localStorage.getItem('compNo') || '0', 10)],
      cylinderExhaustGasTemps: this.fb.array([]) // Initialize as an empty FormArray
    });
  }

  ngOnInit(): void {
    this.loadPerformances();
    this.loadOwnedVessels();
    this.setCylinderCount(this.cylinderCount); // Set default cylinder count on initialization
  }

  loadPerformances(): void {
    const compNo = parseInt(localStorage.getItem('compNo') || '0', 10);
    this.enginePerformanceService.getMainEnginePerformances(compNo).subscribe(
      (data: MainEnginePerformanceMonthly[]) => {
        this.performances = data;
      },
      (error: any) => {
        console.error('Error loading performances', error);
      }
    );
  }

  loadOwnedVessels(): void {
    this.mainService.getAllVessels().subscribe(
      (vessels: vesselModel[]) => {
        this.ownedVessels = vessels;
      },
      (error: any) => {
        console.error('Error loading vessels', error);
      }
    );
  }

  setCylinderCount(count: number): void {
    const cylinderArray = this.performanceForm.get('cylinderExhaustGasTemps') as FormArray;
    cylinderArray.clear(); // Clear existing controls
    for (let i = 0; i < count; i++) {
      cylinderArray.push(this.fb.group({
        pMax: [0],
        pComp: [0],
        exhGasTemp: [0],
        fPumpRackInd: [0],
        vet: [0]
      }));
    }
  }

  getCylinderExhaustGasTemps(): FormArray {
    return this.performanceForm.get('cylinderExhaustGasTemps') as FormArray;
  }

  selectPerformance(performance: MainEnginePerformanceMonthly = {
    id: 0,
    vesselName: '',
    formDate: new Date(),
    personnel: '',
    engineNo: 1,
    cylinderConstantRpm: 0,
    speedRpm: 0,
    presentSpeed: 0,
    totalRunningHours: 0,
    propellerPitch: 0,
    theoreticalShipSpeed: 0,
    vesselCondition: '',
    sea: 0,
    engineRoomTemp: 0,
    sW_Temperature: 0,
    draft_FW_AFT: 0,
    displacement: 0,
    windWindDirection: 0,
    actualShipSpeed: 0,
    shipSlip: 0,
    shipRoute: '',
    fuelLevel: 0,
    governorSpeed: 0,
    speedSetting: 0,
    averageSpeedME: 0,
    averageSpeedTC: 0,
    fuelConsDuring: 0,
    fuelDensity: 0,
    fuelViscosity: 0,
    fuelEngInletTemp: 0,
    meanScavAirPress: 0,
    changeAirTempBefore: 0,
    changeAirTempAfter: 0,
    engineLoad: 0,
    tCExhInletTemp: 0,
    tCExhOutletTemp: 0,
    cylCoolingWaterTemp: 0,
    cylCoolingWaterPress: 0,
    cylLuboilTemp: 0,
    cylLuboilPress: 0,
    oilConsTonsPerDay: 0,
    engineKW: 0,
    compNo: parseInt(localStorage.getItem('compNo') || '0', 10),
    cylinderExhaustGasTemps: []
  }): void {
    this.selectedPerformance = { ...performance };
    this.isPopupVisible = true;
    if (performance.id) {
      this.performanceForm.patchValue(performance);
      this.setCylinderCount(performance.cylinderExhaustGasTemps.length); // Set cylinder count based on existing data
    } else {
      this.setCylinderCount(this.cylinderCount); // Set default cylinder count
    }
  }

  savePerformance(): void {
    if (this.performanceForm.valid) {
      const performance = this.performanceForm.value as MainEnginePerformanceMonthly;
      if (performance.id) {
        // Update existing performance
        this.enginePerformanceService.updateMainEnginePerformance(performance.id, performance).subscribe(
          () => {
            this.loadPerformances();
            this.closePopup();
          },
          (error: any) => {
            console.error('Error updating performance', error);
          }
        );
      } else {
        // Add new performance
        this.enginePerformanceService.addMainEnginePerformance(performance).subscribe(
          () => {
            this.loadPerformances();
            this.closePopup();
          },
          (error: any) => {
            console.error('Error adding performance', error);
          }
        );
      }
    }
  }

  deletePerformance(id: number): void {
    this.enginePerformanceService.deleteMainEnginePerformance(id).subscribe(
      () => {
        this.loadPerformances();
      },
      (error: any) => {
        console.error('Error deleting performance', error);
      }
    );
  }

  closePopup(): void {
    this.isPopupVisible = false;
    this.selectedPerformance = null;
    this.performanceForm.reset();
  }
}
