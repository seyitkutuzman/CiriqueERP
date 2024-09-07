// MainEnginePerformanceDaily.model.ts
export interface CylinderExhaustGasTemp {
    id: number;
    mainEnginePerformanceDailyId: number;
    cylinderNo: number;
    exhaustGasTemp: number;
}

export interface MainEnginePerformanceDaily {
    id: number;
    vesselName: string;
    formDate: Date;
    personnel: string;
    engineNo: number;
    averageSpeedTC: number;
    fuelPressure: number;
    meanScavAirPress: number;
    engineLoad: number;
    tcExhInletTemp: number;
    tcExhOutletTemp: number;
    engineKW: number;
    coolingWaterTemp: number;
    luboilTemp: number;
    coolingWaterPress: number;
    luboilPress: number;
    cylinderExhaustGasTemps: CylinderExhaustGasTemp[];
    compNo: number; // Yeni alan eklendi
}
