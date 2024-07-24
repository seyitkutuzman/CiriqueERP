using CiriqueERP.Data;
using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CiriqueERP.Controllers
{
    [Route("api/controller")]
    [ApiController]
    public class VesselController : ControllerBase
    {
        private readonly MasterContext _context;
        private readonly IConfiguration _configuration;

        public VesselController(MasterContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("vessels")]
        public IActionResult GetVessels([FromBody] VesselModel model)
        {
            if (model.CompNo == 0)
            {
                return BadRequest("Invalid company number");
            }

            var vessels = _context.CoClass
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
                    u.Tasks
                })
                .ToList();

            if (!vessels.Any())
            {
                return NotFound("No vessels found for the given company number");
            }

            return Ok(vessels);
        }

        [HttpPost("addvessel")]
        public IActionResult AddVessel([FromBody] AddVesselModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DateTime openedDate;
            if (!DateTime.TryParse(model.OpenedDate, out openedDate))
            {
                // Varsayılan bir tarih atayın (örneğin: bugünün tarihi)
                openedDate = DateTime.Now;
            }

            var newVessel = new CoClass
            {
                VesselName = model.VesselName,
                CompNo = model.CompNo,
                OpenedDate = openedDate, // Dönüştürülmüş tarih değeri kullanılır
                Status = model.Status,
                Description = model.Description,
                DocNo = model.DocNo,
                Tasks = model.Tasks
            };

            _context.CoClass.Add(newVessel);
            _context.SaveChanges();

            return Ok(new { Message = "Vessel added successfully" });
        }

        [HttpDelete("deleteVessel/{id}")]
        public IActionResult DeleteVessel(int id)
        {
            var vessel = _context.CoClass.FirstOrDefault(v => v.ID == id);
            if (vessel == null)
            {
                return NotFound("Vessel not found");
            }

            _context.CoClass.Remove(vessel);
            _context.SaveChanges();
            return Ok();
        }

    }


    public class VesselModel
    {
        public int CompNo { get; set; }
    }

    public class AddVesselModel
    {
        public string VesselName { get; set; }
        public int CompNo { get; set; }
        public string OpenedDate { get; set; }
        public int Status { get; set; }
        public string Description { get; set; }
        public string DocNo { get; set; }
        public int Tasks { get; set; }
    }
}
