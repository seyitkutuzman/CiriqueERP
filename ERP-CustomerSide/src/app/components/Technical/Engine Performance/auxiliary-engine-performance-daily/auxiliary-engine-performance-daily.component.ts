import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnginePerformanceService } from '../../../../service/enginePerformance.service';
import { AuxiliaryEnginePerformanceDaily } from '../../../../models/auxiliaryEnginePerformanceDaily.model';
import { MainService } from '../../../../service/MainService.service';
import { vesselModel } from '../../../../models/vesselModel';
import { SharedModule } from '../../../../modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auxiliary-engine-performance-daily',
  templateUrl: './auxiliary-engine-performance-daily.component.html',
  styleUrls: ['./auxiliary-engine-performance-daily.component.css'],
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule]
})
export class AuxiliaryEnginePerformanceDailyComponent implements OnInit {
  vessels: vesselModel[] = [];
  selectedVessel: string = '';
  startDate: string = '';
  endDate: string = '';
  performances: AuxiliaryEnginePerformanceDaily[] = [];
  performance: AuxiliaryEnginePerformanceDaily = {} as AuxiliaryEnginePerformanceDaily;
  engineNumbers: number[] = [1, 2, 3, 4, 5]; // Motor numaraları listesi

  constructor(
    private enginePerformanceService: EnginePerformanceService,
    private router: Router,
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.loadVessels();
    this.initializePerformance();
  }

  loadVessels(): void {
    this.mainService.getAllVessels().subscribe(data => {
      this.vessels = data;
      if (this.vessels.length > 0) {
        this.performance.vessel = this.vessels[0].vesselName; // İlk gemiyi varsayılan olarak seçmek
      }
    });
  }

  initializePerformance(): void {
    this.performance = {
      id: 0,
      place: '',
      tasksCompleted: false,
      compNo: 0,
      vessel: '',
      personnel: '',
      engineNo: this.engineNumbers[0], // İlk motor numarasını varsayılan olarak seçmek
      date: new Date(),
      averageSpeed: 0,
      engineLoad: 0,
      engineKW: 0,
      coolingWaterTemp: 0,
      luboilTemp: 0,
      coolingWaterPress: 0,
      luboilPress: 0,
      cylinderExhaustGasTemps: this.engineNumbers.map(number => ({
        cylinderNo: number,
        exhaustGasTemp: 0,
        auxiliaryEnginePerformanceId: this.performance.id,
        AuxiliaryEnginePerformance: this.performance}))
    };
  }

  save(): void {
    // Performans verilerini API'ye göndermeden önce foreign key ve navigasyon özelliklerini ayarlıyoruz
    this.performance.cylinderExhaustGasTemps.forEach(cylinder => {
        cylinder.auxiliaryEnginePerformanceId = this.performance.id; // Foreign Key olarak set ediliyor
        cylinder.AuxiliaryEnginePerformance = this.performance; // Navigasyon özelliği set ediliyor
    });

    // Döngüsel referansı geçici olarak kaldırıyoruz
    const performanceToSave = {...this.performance};
    performanceToSave.cylinderExhaustGasTemps = performanceToSave.cylinderExhaustGasTemps.map(cylinder => {
        const cylinderCopy = {...cylinder};
        delete cylinderCopy.AuxiliaryEnginePerformance; // delete operatörünü kullanıyoruz
        return cylinderCopy;
    });

    if (performanceToSave.id) {
        this.enginePerformanceService.updateAuxiliaryEnginePerformance(performanceToSave.id, performanceToSave).subscribe(() => {
            this.router.navigate(['/auxiliary-engine-performance-daily']);
        });
    } else {
        this.enginePerformanceService.addAuxiliaryEnginePerformance(performanceToSave).subscribe(() => {
            this.router.navigate(['/auxiliary-engine-performance-daily']);
        });
    }
}










  cancel(): void {
    this.router.navigate(['/auxiliary-engine-performance-daily']);
  }
}
