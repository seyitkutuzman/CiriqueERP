using CiriqueERP.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CiriqueERP.Controllers
{
    public class VesselController : ControllerBase
    {
        private readonly MasterContext _context;
        private readonly IConfiguration _configuration;

        public VesselController(MasterContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var user = _context.VesselList
                .Where(u => u.CompNo == model.compNo)
                .Select(u => new
                {
                    u.VesselName,
                    u.CompNo
                })
                .FirstOrDefault();
            return Ok(user);
        }
        }
    }
