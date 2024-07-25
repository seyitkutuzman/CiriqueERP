namespace CiriqueERP.Models
{
    public class Mowner
    {

        public int ID { get; set; }

        public string? VesselName { get; set; }

        public string? DocNo { get; set; }

        public string? Description { get; set; }

        public DateTime OpenedDate { get; set; }

        public int? Status { get; set; }

        public int? Tasks { get; set; }

        public int? CompNo { get; set; }

        public bool? Human { get; set; }

        public bool? System { get; set; }

        public bool? Material { get; set; }

        public string? Subject { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? ExtendedDate { get; set; }

        public DateTime? ClosedDate { get; set; }

        public string? Remarks { get; set; }
    }
}
