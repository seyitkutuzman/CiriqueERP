import { Component, OnInit } from '@angular/core';
import { MainEnginePerformanceDaily } from '../../../../models/MainEnginePerformanceDaily.model';
import { vesselModel } from '../../../../models/vesselModel';
import { EnginePerformanceService } from '../../../../service/enginePerformance.service';
import { MainService } from '../../../../service/MainService.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../modules/shared.module';

@Component({
  selector: 'app-main-engine-performance-daily',
  templateUrl: './main-engine-performance-daily.component.html',
  styleUrls: ['./main-engine-performance-daily.component.css'],
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule]
})
export class MainEnginePerformanceDailyComponent implements OnInit {
  performances: MainEnginePerformanceDaily[] = [];
  ownedVessels: vesselModel[] = [];
  selectedPerformance: MainEnginePerformanceDaily | null = null;
  isPopupVisible = false;

  constructor(private enginePerformanceService: EnginePerformanceService, private mainService: MainService) {}

  ngOnInit(): void {
    this.loadPerformances();
    this.loadOwnedVessels();
  }

  loadPerformances(): void {
    const compNo = parseInt(localStorage.getItem('compNo') || '0', 10);
    this.enginePerformanceService.getMainEnginePerformances(compNo).subscribe(
      (data: MainEnginePerformanceDaily[]) => {
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

  selectPerformance(performance: MainEnginePerformanceDaily = {
    id: 0,
    vesselName: '',
    formDate: new Date(),
    personnel: '',
    engineNo: 1,
    averageSpeedTC: 0,
    fuelPressure: 0,
    meanScavAirPress: 0,
    engineLoad: 0,
    tcExhInletTemp: 0,
    tcExhOutletTemp: 0,
    engineKW: 0,
    coolingWaterTemp: 0,
    luboilTemp: 0,
    coolingWaterPress: 0,
    luboilPress: 0,
    cylinderExhaustGasTemps: Array.from({ length: 6 }, (_, i) => ({
      id: 0,
      mainEnginePerformanceDailyId: 0,
      cylinderNo: i + 1,
      exhaustGasTemp: 0,
    })),
    compNo: parseInt(localStorage.getItem('compNo') || '0', 10), // compNo'yu ekleyin
  }): void {
    this.selectedPerformance = { ...performance };
    this.isPopupVisible = true;
  }

  savePerformance(): void {
    if (this.selectedPerformance) {
      if (this.selectedPerformance.id) {
        this.enginePerformanceService.updateMainEnginePerformance(this.selectedPerformance.id, this.selectedPerformance).subscribe(
          () => {
            this.loadPerformances();
            this.closePopup();
          },
          (error: any) => {
            console.error('Error updating performance', error);
          }
        );
      } else {
        this.enginePerformanceService.addMainEnginePerformance(this.selectedPerformance).subscribe(
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
  }
}
