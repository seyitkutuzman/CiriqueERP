using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CiriqueERP.Data;
using CiriqueERP.Models;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace CiriqueERP.Controllers
{
    [Route("api/controller")]
    [ApiController]
    public class RegulatoryController : ControllerBase
    {
        private readonly MasterContext _context;
        private readonly IConfiguration _configuration;

        public RegulatoryController(MasterContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Get all regulatory information
        [HttpGet("regulatoryInfo")]
        public async Task<IActionResult> GetAllRegulatoryInfo()
        {
            var regulatoryInfo = await _context.Regulatory
                .Select(u => new
                {
                    u.ID,
                    u.Vessel,
                    u.className,
                    u.dueBy,
                    u.implementedDate,
                    u.Description
                })
                .ToListAsync();

            if (!regulatoryInfo.Any())
            {
                return NotFound("No regulatory information found.");
            }

            return Ok(regulatoryInfo);
        }

        // Add new regulatory information
        [HttpPost("regulatoryInfo")]
        public async Task<IActionResult> AddRegulatoryInfo([FromBody] Regulatory model)
        {
            if (ModelState.IsValid)
            {
                _context.Regulatory.Add(model);
                await _context.SaveChangesAsync();
                return Ok(model);
            }

            return BadRequest(ModelState);
        }

        // Delete regulatory information by ID
        [HttpDelete("regulatoryInfo/{id}")]
        public async Task<IActionResult> DeleteRegulatoryInfo(int id)
        {
            var regulatory = await _context.Regulatory.FindAsync(id);
            if (regulatory == null)
            {
                return NotFound("Regulatory information not found.");
            }

            _context.Regulatory.Remove(regulatory);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Update regulatory information
        [HttpPut("updateRegulatory")]
        public async Task<IActionResult> UpdateRegulatoryInfo([FromBody] Regulatory model)
        {
            if (ModelState.IsValid)
            {
                _context.Regulatory.Update(model);
                await _context.SaveChangesAsync();
                return Ok(model);
            }

            return BadRequest(ModelState);
        }
    }
}
