using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class DocumentSection
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SectionName { get; set; }
    }
}
