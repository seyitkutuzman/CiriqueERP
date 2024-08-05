using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class DrydockJob
    {
        public int Id { get; set; }
        [Required]
        public string JobCode { get; set; }
        [Required]
        public string JobTitle { get; set; }
        public string UnitType { get; set; }
        public string Description { get; set; }
    }
}
