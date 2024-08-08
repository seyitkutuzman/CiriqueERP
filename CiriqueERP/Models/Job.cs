namespace CiriqueERP.Models
{
    public class Job
    {
        public int? Id { get; set; }
        public int CompNo { get; set; } // Yeni Alan
        public string Vessel { get; set; }
        public string Component { get; set; }
        public string JobTitle { get; set; }
        public string JobCode { get; set; }
        public string ResponsiblePersonnel { get; set; }
        public string JobType { get; set; }
        public string CounterName { get; set; }
        public int PMHour { get; set; }
        public int JobStart { get; set; }
        public int JobOverdue { get; set; }
        public string JobProcedures { get; set; }
        public string InstructionFile { get; set; }
        public string RASDocument { get; set; }
        public string RASTemplate { get; set; }
        public bool IsRAS { get; set; }
        public bool IsCE { get; set; }
        public bool VisualOnly { get; set; }
        public bool AttachmentRequired { get; set; }
        public bool CEShutdown { get; set; }
        public string JobConstant { get; set; }
        public string FileType { get; set; }
        public string Priority { get; set; }
        public string Description { get; set; }
    }
}
