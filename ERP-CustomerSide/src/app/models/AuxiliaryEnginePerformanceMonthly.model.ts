export interface AuxiliaryEnginePerformanceMonthly {
  id: number;
  vessel: string;
  personnel: string;
  engineNo: number;
  formDate: Date;
  presentSpeed: number;
  totalRunningHours: number;
  sw_Temperature: number; // 'swTemperature' değil 'sw_Temperature'
  fuelViscosity: number;
  fuelEngInletTemp: number;
  fuelPressure: number;
  meanScavAirPress: number;
  engineLoad: number;
  mainScavExhAirTemp: number;
  engineKW: number;
  cylCoolingWaterTemp: number;
  cylCoolingWaterPress: number;
  cylLuboilTemp: number;
  cylLuboilPress: number;
  oilConsTonsPerDay: number; // Eksik olan özellik
  cylinderExhaustGasTemps: CylinderExhaustGasTempMonthly[];
}

  
export interface CylinderExhaustGasTempMonthly {
  id: number;
  cylinderNo: number;
  pMax: number; // 'pmax' değil 'pMax'
  pComp: number; // 'pcomp' değil 'pComp'
  exhGasTemp: number; // 'exhaustGasTemp' değil 'exhGasTemp'
  fPumpRackInd: number; // 'fpumpRok' değil 'fPumpRackInd'
  auxiliaryEnginePerformanceId: number;
  auxiliaryEnginePerformanceMonthly?: AuxiliaryEnginePerformanceMonthly;
}

  
  