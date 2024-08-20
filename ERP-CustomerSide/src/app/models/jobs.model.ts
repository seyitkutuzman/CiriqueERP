export interface Job {
    id?: number;
    vessel: string;
    component: string;
    jobCode: string;
    jobTitle: string;
    jobType: string;
    priority: string;
    description: string;
    ras: boolean;
    ce: boolean;
    descFile: string;
    instructionFile: string;
    tasks: string;
    compNo: number;
    descFileUrl?: string | null;
  instructionFileUrl?: string | null;
}
