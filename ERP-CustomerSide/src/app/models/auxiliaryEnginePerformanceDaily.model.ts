export interface AuxiliaryEnginePerformanceDaily {
    id: number;
    vessel: string;
    personnel: string;
    place: string;
    date: Date;
    engineNo: number;
    tasksCompleted: boolean;
    compNo: number;

    // Yeni Eklenen Özellikler
    averageSpeed: number;
    engineLoad: number;
    engineKW: number;
    coolingWaterTemp: number;
    luboilTemp: number;
    coolingWaterPress: number;
    luboilPress: number;
    cylinderExhaustGasTemps: CylinderExhaustGasTemp[];
}

export interface CylinderExhaustGasTemp {
    cylinderNo: number;
    exhaustGasTemp: number;
    auxiliaryEnginePerformanceId?: number; // Bu satırı ekleyin
    AuxiliaryEnginePerformance?: AuxiliaryEnginePerformanceDaily;
}
