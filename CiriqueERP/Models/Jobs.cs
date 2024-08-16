using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class Job
    {
        public int? Id { get; set; }
        public string Vessel { get; set; }
        public string Component { get; set; }
        public string JobCode { get; set; }
        public string JobTitle { get; set; }
        public string JobType { get; set; }
        public string Priority { get; set; }
        public string Description { get; set; }
        public bool? RAS { get; set; }  // Boolean field
        public bool? CE { get; set; }   // Boolean field
        public string DescFile { get; set; }
        public string InstructionFile { get; set; }
        public string Tasks { get; set; }
        public int CompNo { get; set; }

        public string DescFileUrl => string.IsNullOrEmpty(DescFile) ? null : $"/uploads/{Path.GetFileName(DescFile)}";
        public string InstructionFileUrl => string.IsNullOrEmpty(InstructionFile) ? null : $"/uploads/{Path.GetFileName(InstructionFile)}";
    }

}
