export interface Job {
    id?: number;
    compNo: number;  // Yeni Alan
    vessel: string;
    component: string;
    jobTitle: string;
    jobCode: string;
    responsiblePersonnel: string;
    jobType: string;
    counterName: string;
    pmHour: number;
    jobStart: number;
    jobOverdue: number;
    jobProcedures: string;
    instructionFile: string;
    rasDocument: string;
    rasTemplate: string;
    isRAS: boolean;
    isCE: boolean;
    visualOnly: boolean;
    attachmentRequired: boolean;
    ceShutdown: boolean;
    jobConstant: string;
    fileType: string;
    priority: string;
    description: string;
}
