// service-report.model.ts
export interface ServiceReport {
    reportID: number;               // Primary Key
    vesselName: string;             // Vessel Name
    vesselComponent: string;        // Vessel Component
    company: string;                // Company Name
    reportDate: Date;               // Report Date
    description: string;            // Description
    documentFile: string;           // File path or URL for document attachment
    createdBy: string;              // Created By User
    createdDate: Date;              // Date of Creation
    compNo: number;                 // Company Number
  }
  