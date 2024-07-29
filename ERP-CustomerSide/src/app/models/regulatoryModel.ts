export interface regulatoryModel {
  id: number;
  vessel: string;
  className: string;
  description: string;
  dueBy: Date | string | null;
  implementedDate: Date | string | null;
}
