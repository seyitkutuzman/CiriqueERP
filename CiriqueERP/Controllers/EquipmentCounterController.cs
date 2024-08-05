using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data;
using CiriqueERP.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Controllers
{
    [Route("api/controller")]
    [ApiController]
    public class EquipmentCounterController : ControllerBase
    {
        private readonly MasterContext _context;

        public EquipmentCounterController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("getCounters")]
        public async Task<ActionResult<IEnumerable<EquipmentCounter>>> GetEquipmentCounters()
        {
            return await _context.EquipmentCounters.ToListAsync();
        }

        [HttpPost("addCounter")]
        public async Task<ActionResult<EquipmentCounter>> PostEquipmentCounter(EquipmentCounter equipmentCounter)
        {
            _context.EquipmentCounters.Add(equipmentCounter);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEquipmentCounters), new { id = equipmentCounter.Id }, equipmentCounter);
        }

        [HttpPut("updateCounter/{id}")]
        public async Task<IActionResult> PutEquipmentCounter(int id, EquipmentCounter equipmentCounter)
        {
            if (id != equipmentCounter.Id)
            {
                return BadRequest();
            }

            _context.Entry(equipmentCounter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.EquipmentCounters.Any(e => e.Id == id))
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

        [HttpDelete("deleteCounter/{id}")]
        public async Task<IActionResult> DeleteEquipmentCounter(int id)
        {
            var equipmentCounter = await _context.EquipmentCounters.FindAsync(id);
            if (equipmentCounter == null)
            {
                return NotFound();
            }

            _context.EquipmentCounters.Remove(equipmentCounter);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
