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

        [HttpGet("getJobs/{compNo}")]
        public async Task<ActionResult<IEnumerable<DrydockJob>>> GetJobs(int compNo)
        {
            return await _context.DrydockJobs
                .Where(j => j.compNo == compNo)
                .ToListAsync();
        }

        [HttpPost("addJob")]
        public async Task<ActionResult<DrydockJob>> PostJob(DrydockJob job)
        {
            

            _context.DrydockJobs.Add(job);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJobs), new { compNo = job.compNo, id = job.Id }, job);
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
                if (!JobExists(id))
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

        [HttpDelete("deleteJob/{id}/{compNo}")]
        public async Task<IActionResult> DeleteJob(int id, int compNo)
        {

            var job = await _context.DrydockJobs
                .Where(j => j.Id == id && j.compNo == compNo)
                .FirstOrDefaultAsync();

            if (job == null)
            {
                return NotFound();
            }

            _context.DrydockJobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JobExists(int id)
        {
            return _context.DrydockJobs.Any(e => e.Id == id);
        }

        
    }
}
