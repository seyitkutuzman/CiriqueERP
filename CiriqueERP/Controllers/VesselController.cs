using CiriqueERP.Data;
using Microsoft.AspNetCore.Mvc;

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
                    u.VesselName,
                    u.CompNo,
                    u.OpenedDate,
                    u.Status,
                    u.Description,
                    u.DocNo,
                    u.Tasks
                }
                )
                .ToList();

            if (!vessels.Any())
            {
                return NotFound("No vessels found for the given company number");
            }

            return Ok(vessels);
        }
    }

    public class VesselModel
    {
        public int CompNo { get; set; }
    }
}
