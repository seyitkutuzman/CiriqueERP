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

        [HttpGet("getPlannings/{compNo}")]
        public async Task<ActionResult<IEnumerable<DrydockPlanning>>> GetPlannings(int compNo)
        {
            return await _context.DrydockPlannings
                .Where(dp => dp.compNo == compNo)
                .ToListAsync();
        }

        [HttpPost("addPlanning")]
        public async Task<IActionResult> AddPlanning([FromBody] DrydockPlanning planning)
        {
            if (planning == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.DrydockPlannings.Add(planning);
            await _context.SaveChangesAsync();

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

        [HttpDelete("deletePlanning/{id}/{compNo}")]
        public async Task<IActionResult> DeletePlanning(int id, int compNo)
        {
            var planning = await _context.DrydockPlannings
                .Where(dp => dp.Id == id && dp.compNo == compNo)
                .FirstOrDefaultAsync();

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
