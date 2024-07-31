namespace CiriqueERP.Models
{
    public class Job
    {
        public int? Id { get; set; }
        public string Vessel { get; set; }
        public string JobType { get; set; }
        public string Priority { get; set; }
        public string JobTitle { get; set; }
        public string JobCode { get; set; }
        public string Description { get; set; }
        public bool? IsRAS { get; set; }
        public bool? IsCE { get; set; }
    }
}
