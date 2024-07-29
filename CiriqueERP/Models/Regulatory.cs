namespace CiriqueERP.Models
{
    public class Regulatory
    {
        public int ID { get; set; }

        public string? Vessel { get; set; }

        public string? className { get; set; }

        public DateTime? dueBy { get; set; }

        public DateTime? implementedDate { get; set; }

        public string? Description { get; set; }
    }
}
