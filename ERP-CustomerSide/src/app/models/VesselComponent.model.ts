export interface VesselComponent {
    id?: number;
    vessel: string;
    componentName: string;
    maker?: string;
    model?: string;
    serial?: string;
    priority: string;
    troubleshootingFile?: string;
    isExProof?: boolean;
    isClassRelated?: boolean;
    hasSparePart?: boolean;
  }
  