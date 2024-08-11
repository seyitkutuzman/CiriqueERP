using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class Certificate
    {
        public int? Id { get; set; }
        [Required]
        public string CertificateName { get; set; }
        [Required]
        public string CertificateNo { get; set; }
        [Required]
        public string CertificateGroup { get; set; }
        [Required]
        public string CertificateType { get; set; }
        [Required]
        public string Department { get; set; }
        public int? Renewal { get; set; }
        public int? RenewalTw { get; set; }
        public int? Annual { get; set; }
        public int? AnnualTw { get; set; }
        public int? Intermediate { get; set; }
        public int? IntermediateTw { get; set; }
        public string Comment { get; set; }
        public int compNo { get; set; }
    }
}
