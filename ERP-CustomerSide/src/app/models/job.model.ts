export interface Job {
    id?: number;
    vessel: string;
    jobType: string;
    priority: string;
    jobTitle?: string;
    jobCode?: string;
    description?: string;
    isRAS?: boolean;
    isCE?: boolean;
  }
  