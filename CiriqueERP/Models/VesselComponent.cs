using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class VesselComponent
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Vessel { get; set; }
        [Required]
        public string ComponentName { get; set; }
        public string Maker { get; set; }
        public string Model { get; set; }
        public string Serial { get; set; }
        public string Priority { get; set; }
        public string TroubleshootingFile { get; set; }
        public bool IsExProof { get; set; }
        public bool IsClassRelated { get; set; }
        public bool HasSparePart { get; set; }

        public int compNo { get; set; }
    }
}
