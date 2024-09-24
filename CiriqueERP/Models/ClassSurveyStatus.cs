using System;
using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class ClassSurveyStatus
    {
        [Key]
        public int SurveyID { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string VesselName { get; set; }
        
        [Required]
        public DateTime ReportedDate { get; set; }
        
        public string Description { get; set; }
        
        [MaxLength(255)]
        public string DocumentPath { get; set; }
        
        [MaxLength(255)]
        public string ConfirmedPersonnel { get; set; } // Onaylayan personelin adı ve soyadı
        
        public DateTime ConfirmedDate { get; set; } = DateTime.Now; // Varsayılan olarak kaydın oluşturulduğu tarih
        
        [Required]
        public int CompNo { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string CreatedBy { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.Now; // Varsayılan olarak oluşturma tarihi
    }
}
