export interface Certificate {
    id?: number;
    certificateName: string;
    certificateNo: string;
    certificateGroup: string;
    certificateType: string;
    department: string;
    renewal?: number;
    renewalTw?: number;
    annual?: number;
    annualTw?: number;
    intermediate?: number;
    intermediateTw?: number;
    comment: string;
  }
  