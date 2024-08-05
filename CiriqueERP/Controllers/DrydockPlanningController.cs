using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data;
using CiriqueERP.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Controllers
{
    [Route("api/drydock-planning")]
    [ApiController]
    public class DrydockPlanningController : ControllerBase
    {
        private readonly MasterContext _context;

        public DrydockPlanningController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("getPlannings")]
        public async Task<ActionResult<IEnumerable<DrydockPlanning>>> GetPlannings()
        {
            return await _context.DrydockPlannings.ToListAsync();
        }
        [HttpPost("addPlanning")]
        public async Task<IActionResult> AddPlanning([FromBody] DrydockPlanning planning)
        {
            if (planning == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.DrydockPlannings.Add(planning);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

            return Ok();
        }




        [HttpPut("updatePlanning/{id}")]
        public async Task<IActionResult> UpdatePlanning(int id, DrydockPlanning planning)
        {
            if (id != planning.Id)
            {
                return BadRequest();
            }

            _context.Entry(planning).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.DrydockPlannings.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("deletePlanning/{id}")]
        public async Task<IActionResult> DeletePlanning(int id)
        {
            var planning = await _context.DrydockPlannings.FindAsync(id);
            if (planning == null)
            {
                return NotFound();
            }

            _context.DrydockPlannings.Remove(planning);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
