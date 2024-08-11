using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data;
using CiriqueERP.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Controllers
{
    [Route("api/vessel-components")]
    [ApiController]
    public class VesselComponentController : ControllerBase
    {
        private readonly MasterContext _context;

        public VesselComponentController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("getComponents/{compNo}")]
        public async Task<ActionResult<IEnumerable<VesselComponent>>> GetVesselComponents(int compNo)
        {
            return await _context.VesselComponents
                .Where(vc => vc.compNo == compNo)
                .ToListAsync();
        }

        [HttpPost("addComponent")]
        public async Task<ActionResult<VesselComponent>> PostVesselComponent(VesselComponent vesselComponent)
        {

            _context.VesselComponents.Add(vesselComponent);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVesselComponents), new { compNo = vesselComponent.compNo, id = vesselComponent.Id }, vesselComponent);
        }

        [HttpPut("updateComponent/{id}")]
        public async Task<IActionResult> PutVesselComponent(int id, VesselComponent vesselComponent)
        {
            

            if (id != vesselComponent.Id || vesselComponent.compNo == 0)
            {
                return BadRequest();
            }

            _context.Entry(vesselComponent).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.VesselComponents.Any(e => e.Id == id))
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

        [HttpDelete("deleteComponent/{id}/{compNo}")]
        public async Task<IActionResult> DeleteVesselComponent(int id, int compNo)
        {
            

            var vesselComponent = await _context.VesselComponents
                .Where(vc => vc.Id == id && vc.compNo == compNo)
                .FirstOrDefaultAsync();

            if (vesselComponent == null)
            {
                return NotFound();
            }

            _context.VesselComponents.Remove(vesselComponent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
    }
}
