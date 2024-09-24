export interface CertificateAndSurvey {
    certificateID: number;
    vesselName: string;
    department?: string;
    certificateGroup?: string;
    certificateName: string;
    type?: string;
    issuedDate?: Date;
    expirationDate?: Date;
    issuedBy?: string;
    term?: string;
    renewalMonths?: number;
    annualMonths?: number;
    intermediateMonths?: number;
    validationStartDate?: Date;
    documentNo?: string;
    hasDispensation: boolean;
    hasExemption: boolean;
    createdBy?: string;
    createdDate: Date;
    updatedDate?: Date;
    comment?: string; // Not: `comment` yerine `Comment` kullanılmalı
    certificateFiles?: CertificateFile[];
}

  
  export interface CertificateFile {
    fileID: number;
    certificateID: number;
    fileName: string;
    filePath: string;
    fileComment?: string;
    fileAddedDate: Date;
  }
  