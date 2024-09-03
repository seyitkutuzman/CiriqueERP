import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnginePerformanceService } from '../../../../service/enginePerformance.service';
import { AuxiliaryEnginePerformanceMonthly } from '../../../../models/AuxiliaryEnginePerformanceMonthly.model';
import { MainService } from '../../../../service/MainService.service';
import { vesselModel } from '../../../../models/vesselModel';
import { SharedModule } from '../../../../modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-auxiliary-engine-performance-monthly',
  templateUrl: './auxiliary-engine-performance-monthly.component.html',
  styleUrls: ['./auxiliary-engine-performance-monthly.component.css'],
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule]
})
export class AuxiliaryEnginePerformanceMonthlyComponent implements OnInit {
  vessels: vesselModel[] = [];
  selectedVessel: string = '';
  startDate: string = '';
  endDate: string = '';
  performances: AuxiliaryEnginePerformanceMonthly[] = [];
  performance: AuxiliaryEnginePerformanceMonthly = {} as AuxiliaryEnginePerformanceMonthly;
  cylinderCount: number = 5; // Varsayılan silindir sayısı
  modalInstance: any;

  constructor(
    private enginePerformanceService: EnginePerformanceService,
    private router: Router,
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.loadVessels();
    this.initializePerformance();
    this.loadPerformances();
  }

  loadPerformances(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    const compNo = parseInt(decodedToken?.CompNo, 10);

    if (!isNaN(compNo)) {
      this.enginePerformanceService.getAuxiliaryEnginePerformanceMonthly(compNo).subscribe(
        data => {
          console.log('Fetched Performances:', data);
          this.performances = data;
        },
        error => {
          console.error('Error loading performances:', error);
        }
      );
    }
  }

  openModal(): void {
    const modalElement = document.getElementById('performanceModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  editPerformance(performance: AuxiliaryEnginePerformanceMonthly): void {
    this.enginePerformanceService.getAuxiliaryEnginePerformanceMonthlyDetail(performance.id).subscribe({
      next: (data) => {
        this.performance = { ...data };
        this.cylinderCount = this.performance.cylinderExhaustGasTemps.length; // Silindir sayısını güncelle
        this.openModal();
      },
      error: (error) => {
        console.error('Error fetching performance details:', error);
      }
    });
  }

  updatePerformance(): void {
    if (this.performance.id) {
      this.enginePerformanceService.updateAuxiliaryEnginePerformanceMonthly(this.performance.id, this.performance).subscribe({
        next: () => {
          console.log('Performance updated successfully.');
          this.closeModal();
          this.loadPerformances();
        },
        error: (error) => {
          console.error('Error updating performance:', error);
        }
      });
    }
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
      if (this.vessels.length > 0) {
        this.performance.vessel = this.vessels[0].vesselName;
      }
    });
  }

  initializePerformance(): void {
    this.performance = {
      id: 0,
      vessel: '',
      personnel: '',
      engineNo: 1,
      formDate: new Date(),
      presentSpeed: 0,
      totalRunningHours: 0,
      sw_Temperature: 0,
      fuelViscosity: 0,
      fuelEngInletTemp: 0,
      fuelPressure: 0,
      meanScavAirPress: 0,
      engineLoad: 0,
      mainScavExhAirTemp: 0,
      engineKW: 0,
      cylCoolingWaterTemp: 0,
      cylCoolingWaterPress: 0,
      cylLuboilTemp: 0,
      cylLuboilPress: 0,
      oilConsTonsPerDay: 0,
      cylinderExhaustGasTemps: Array(this.cylinderCount).fill(0).map((_, index) => ({
        id: 0,
        cylinderNo: index + 1,
        pMax: 0,
        pComp: 0,
        exhGasTemp: 0,
        fPumpRackInd: 0,
        auxiliaryEnginePerformanceId: this.performance.id,
        auxiliaryEnginePerformanceMonthly: this.performance // Performans kaydedildikten sonra ayarlanacak
      }))
    };
  }

  save(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    const compNo = parseInt(decodedToken?.CompNo, 10);

    if (isNaN(compNo)) {
        console.error("Company number is not available");
        return;
    }

    const performanceToSave = { ...this.performance, compNo };

    // CylinderExhaustGasTemps için auxiliaryEnginePerformanceId alanını ayarla ve navigasyon özelliğini kaldır
    performanceToSave.cylinderExhaustGasTemps.forEach(cylinder => {
        cylinder.auxiliaryEnginePerformanceId = this.performance.id || 0; 
        delete cylinder.auxiliaryEnginePerformanceMonthly; // Navigasyon özelliğini kaldır
    });

    if (performanceToSave.id) {
        this.enginePerformanceService.updateAuxiliaryEnginePerformanceMonthly(performanceToSave.id, performanceToSave).subscribe(
            () => {
                this.closeModal();
                this.loadPerformances();
            },
            error => {
                console.error('Error updating performance:', error);
            }
        );
    } else {
        this.enginePerformanceService.addAuxiliaryEnginePerformanceMonthly(performanceToSave).subscribe(
            () => {
                this.closeModal();
                this.loadPerformances();
            },
            error => {
                console.error('Error adding performance:', error);
            }
        );
    }
}





  cancel(): void {
    this.closeModal();
  }
}
