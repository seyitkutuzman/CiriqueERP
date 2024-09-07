import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnginePerformanceService } from '../../../../service/enginePerformance.service';
import { AuxiliaryEnginePerformanceDaily } from '../../../../models/auxiliaryEnginePerformanceDaily.model';
import { MainService } from '../../../../service/MainService.service';
import { vesselModel } from '../../../../models/vesselModel';
import { SharedModule } from '../../../../modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var bootstrap: any;

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
  cylinderCount: number = 5; // Başlangıçta 5 cylinder varsayılan olarak ayarlanmış
  modalInstance: any; // Modal instance tanımı

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

    this.enginePerformanceService.getAuxiliaryEnginePerformances(compNo).subscribe(
      data => {
        console.log('Fetched Performances:', data); // Performans verilerini loglayın
        this.performances = data;
      },
      error => {
        console.error('Error loading performances:', error); // Eğer hata varsa log alın
      }
    );
  }

  openModal(): void {
    const modalElement = document.getElementById('performanceModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement); // Modal instance'ı kaydediyoruz
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  editPerformance(performance: AuxiliaryEnginePerformanceDaily): void {
    this.enginePerformanceService.getAuxiliaryEnginePerformanceDetail(performance.id).subscribe({
      next: (data) => {
        this.performance = { ...data }; // Performansı backend'den tam haliyle alıyoruz
        this.openModal(); // Modalı açıyoruz
      },
      error: (error) => {
        console.error('Error fetching performance details:', error);
      }
    });
  }

  updatePerformance(): void {
    if (this.performance.id) {
      // Performansı güncelle
      this.enginePerformanceService.updateAuxiliaryEnginePerformance(this.performance.id, this.performance).subscribe({
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
      place: '',
      tasksCompleted: false,
      compNo: 0,
      vessel: '',
      personnel: '',
      engineNo: this.engineNumbers[0],
      date: new Date(),
      averageSpeed: 0,
      engineLoad: 0,
      engineKW: 0,
      coolingWaterTemp: 0,
      luboilTemp: 0,
      coolingWaterPress: 0,
      luboilPress: 0,
      cylinderExhaustGasTemps: this.generateCylinderTemps()
    };
  }

  updateCylinders(): void {
    // Kullanıcının seçtiği silindir sayısına göre verileri güncelle
    this.performance.cylinderExhaustGasTemps = this.generateCylinderTemps();
  }

  generateCylinderTemps(): { cylinderNo: number, exhaustGasTemp: number, auxiliaryEnginePerformanceId: number }[] {
    return Array.from({ length: this.cylinderCount }, (_, i) => ({
      cylinderNo: i + 1,
      exhaustGasTemp: 0,
      auxiliaryEnginePerformanceId: this.performance.id
    }));
  }

  save(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const decodedToken = this.mainService.decodeToken(currentUser?.accessToken);
    const compNo = decodedToken?.CompNo;

    if (!compNo) {
      console.error("Company number is not available");
      return;
    }

    this.performance.cylinderExhaustGasTemps.forEach(cylinder => {
      cylinder.auxiliaryEnginePerformanceId = this.performance.id;
    });

    const performanceToSave = { ...this.performance, compNo };

    performanceToSave.cylinderExhaustGasTemps.forEach(cylinder => {
      delete cylinder.AuxiliaryEnginePerformance;
    });

    if (performanceToSave.id) {
      this.enginePerformanceService.updateAuxiliaryEnginePerformance(performanceToSave.id, performanceToSave).subscribe(() => {
        this.closeModal();
        this.loadPerformances();
      });
    } else {
      this.enginePerformanceService.addAuxiliaryEnginePerformance(performanceToSave).subscribe(() => {
        this.closeModal();
        this.loadPerformances();
      });
    }
  }

  cancel(): void {
    this.closeModal();
  }
}
