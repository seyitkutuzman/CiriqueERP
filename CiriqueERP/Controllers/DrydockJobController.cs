using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data;
using CiriqueERP.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Controllers
{
    [Route("api/drydockjobs")]
    [ApiController]
    public class DrydockJobController : ControllerBase
    {
        private readonly MasterContext _context;

        public DrydockJobController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("getJobs")]
        public async Task<ActionResult<IEnumerable<DrydockJob>>> GetJobs()
        {
            return await _context.DrydockJobs.ToListAsync();
        }

        [HttpPost("addJob")]
        public async Task<ActionResult<DrydockJob>> PostJob(DrydockJob job)
        {
            _context.DrydockJobs.Add(job);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJobs), new { id = job.Id }, job);
        }

        [HttpPut("updateJob/{id}")]
        public async Task<IActionResult> PutJob(int id, DrydockJob job)
        {
            if (id != job.Id)
            {
                return BadRequest();
            }

            _context.Entry(job).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.DrydockJobs.Any(e => e.Id == id))
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

        [HttpDelete("deleteJob/{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.DrydockJobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }

            _context.DrydockJobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
