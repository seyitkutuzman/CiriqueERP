using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using CiriqueERP.Data;

namespace CiriqueERP.Controllers
{
    [Route("api/controller")]
    [ApiController]
    public class MownerController : ControllerBase
    {
        private readonly MasterContext _context;
        private readonly IConfiguration _configuration;

        public MownerController(MasterContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Mowners")]
        public IActionResult GetVessels([FromBody] MownerModel model)
        {
            if (model.CompNo == 0)
            {
                return BadRequest("Invalid company number");
            }

            var vessels = _context.Mowner
                .Where(u => u.CompNo == model.CompNo)
                .Select(u => new
                {
                    u.ID,
                    u.VesselName,
                    u.CompNo,
                    u.OpenedDate,
                    u.Status,
                    u.Description,
                    u.DocNo,
                    u.Tasks,
                    u.ExtendedDate,
                    u.DueDate,
                    u.ClosedDate,
                    u.Human,
                    u.System,
                    u.Material,
                    u.Subject,
                    u.Remarks
                })
                .ToList();

            if (!vessels.Any())
            {
                return NotFound("No vessels found for the given company number");
            }

            return Ok(vessels);
        }

        [HttpPost("addMowner")]
        public IActionResult AddVessel([FromBody] AddMownerModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newVessel = new Mowner
            {
                VesselName = model.VesselName,
                CompNo = model.CompNo,
                OpenedDate = string.IsNullOrEmpty(model.OpenedDate) ? DateTime.Now : DateTime.Parse(model.OpenedDate),
                DueDate = string.IsNullOrEmpty(model.DueDate) ? DateTime.Now : DateTime.Parse(model.DueDate),
                ExtendedDate = string.IsNullOrEmpty(model.ExtendedDate) ? (DateTime?)null : DateTime.Parse(model.ExtendedDate),
                ClosedDate = string.IsNullOrEmpty(model.ClosedDate) ? (DateTime?)null : DateTime.Parse(model.ClosedDate),
                Status = model.Status,
                Description = model.Description,
                DocNo = model.DocNo,
                Tasks = model.Tasks,
                Human = model.Human,
                System = model.System,
                Material = model.Material,
                Subject = model.Subject,
                Remarks = model.Remarks
            };

            _context.Mowner.Add(newVessel);
            _context.SaveChanges();

            return Ok(new { Message = "Vessel added successfully" });
        }

        [HttpDelete("deleteMowner/{id}")]
        public IActionResult DeleteVessel(int id)
        {
            var vessel = _context.Mowner.FirstOrDefault(v => v.ID == id);
            if (vessel == null)
            {
                return NotFound("Vessel not found");
            }

            _context.Mowner.Remove(vessel);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("updateMowner")]
        public IActionResult UpdateVessel([FromBody] AddMownerModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vessel = _context.Mowner.FirstOrDefault(v => v.ID == model.ID);
            if (vessel == null)
            {
                return NotFound("Vessel not found");
            }
            vessel.VesselName = model.VesselName;
            vessel.CompNo = model.CompNo;
            vessel.OpenedDate = string.IsNullOrEmpty(model.OpenedDate) ? vessel.OpenedDate : DateTime.Parse(model.OpenedDate);
            vessel.Status = model.Status;
            vessel.Description = model.Description;
            vessel.DocNo = model.DocNo;
            vessel.Tasks = model.Tasks;
            vessel.DueDate = string.IsNullOrEmpty(model.DueDate) ? vessel.DueDate : DateTime.Parse(model.DueDate);
            vessel.ExtendedDate = string.IsNullOrEmpty(model.ExtendedDate) ? vessel.ExtendedDate : DateTime.Parse(model.ExtendedDate);
            vessel.ClosedDate = string.IsNullOrEmpty(model.ClosedDate) ? vessel.ClosedDate : DateTime.Parse(model.ClosedDate);
            vessel.Remarks = model.Remarks;

            _context.SaveChanges();

            return Ok(vessel);
        }

    }

    public class MownerModel
    {
        public int CompNo { get; set; }
    }

    public class AddMownerModel
    {
        public int ID { get; set; }
        public string VesselName { get; set; }
        public int CompNo { get; set; }
        public string OpenedDate { get; set; }
        public string DueDate { get; set; }
        public string? ExtendedDate { get; set; }
        public string? ClosedDate { get; set; }
        public int Status { get; set; }
        public string Description { get; set; }
        public string DocNo { get; set; }
        public int Tasks { get; set; }
        public bool Human { get; set; }
        public bool System { get; set; }
        public bool Material { get; set; }
        public string Subject { get; set; }
        public string Remarks { get; set; }
    }
}
