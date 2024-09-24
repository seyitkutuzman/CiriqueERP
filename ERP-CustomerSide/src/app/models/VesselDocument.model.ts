// vessel-document.model.ts
export interface VesselDocument {
    documentID: number;            // Primary Key
    vesselName: string;            // Vessel Name
    documentType: string;          // Document Type
    sectionName: string;           // Section Name
    equipment: string;             // Equipment Name
    bookName: string;              // Book Title
    description: string;           // Description
    filePath: string;              // File path or URL for document attachment
    createdBy: string;             // Created By User
    createdDate: Date;             // Date of Creation
    compNo: number;                // Company Number
  }
  