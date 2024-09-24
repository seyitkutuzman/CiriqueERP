// MainEnginePerformanceMonthly.model.ts
export interface CylinderExhaustGasTempMainEngineMonthly {
    id: number;
    mainEnginePerformanceMonthlyId: number;
    cylinderNo: number;
    pMax: number;
    pComp: number;
    exhGasTemp: number;
    fPumpRackInd: number;
    vet: number;
  }
  
  export interface MainEnginePerformanceMonthly {
    id: number;
    vesselName: string;
    formDate: Date;
    personnel: string;
    engineNo: number;
    cylinderConstantRpm: number;
    speedRpm: number;
    presentSpeed: number;
    totalRunningHours: number;
    propellerPitch: number;
    theoreticalShipSpeed: number;
    vesselCondition: string;
    sea: number;
    engineRoomTemp: number;
    sW_Temperature: number;
    draft_FW_AFT: number;
    displacement: number;
    windWindDirection: number;
    actualShipSpeed: number;
    shipSlip: number;
    shipRoute: string;
    fuelLevel: number;
    governorSpeed: number;
    speedSetting: number;
    averageSpeedME: number;
    averageSpeedTC: number;
    fuelConsDuring: number;
    fuelDensity: number;
    fuelViscosity: number;
    fuelEngInletTemp: number;
    meanScavAirPress: number;
    changeAirTempBefore: number;
    changeAirTempAfter: number;
    engineLoad: number;
    tCExhInletTemp: number;
    tCExhOutletTemp: number;
    cylCoolingWaterTemp: number;
    cylCoolingWaterPress: number;
    cylLuboilTemp: number;
    cylLuboilPress: number;
    oilConsTonsPerDay: number;
    engineKW: number;
    compNo: number;
    cylinderExhaustGasTemps: CylinderExhaustGasTempMainEngineMonthly[];
  }
  