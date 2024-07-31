using System.ComponentModel.DataAnnotations.Schema;

namespace CiriqueERP.Models
{
    public class DrydockPlanning
    {
        [ForeignKey("VesselId")]

        public virtual VesselList Vessel { get; set; }

        public int Id { get; set; }
        public int? VesselId { get; set; }
        public string ShipyardName { get; set; }
        public DateTime PlannedStartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Currency { get; set; }
        public string Comment { get; set; }

    }


}