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

        [HttpGet("getComponents")]
        public async Task<ActionResult<IEnumerable<VesselComponent>>> GetVesselComponents()
        {
            return await _context.VesselComponents.ToListAsync();
        }

        [HttpPost("addComponent")]
        public async Task<ActionResult<VesselComponent>> PostVesselComponent(VesselComponent vesselComponent)
        {
            _context.VesselComponents.Add(vesselComponent);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVesselComponents), new { id = vesselComponent.Id }, vesselComponent);
        }

        [HttpPut("updateComponent/{id}")]
        public async Task<IActionResult> PutVesselComponent(int id, VesselComponent vesselComponent)
        {
            if (id != vesselComponent.Id)
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

        [HttpDelete("deleteComponent/{id}")]
        public async Task<IActionResult> DeleteVesselComponent(int id)
        {
            var vesselComponent = await _context.VesselComponents.FindAsync(id);
            if (vesselComponent == null)
            {
                return NotFound();
            }

            _context.VesselComponents.Remove(vesselComponent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("uploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var filePath = Path.Combine("uploads", file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { FilePath = filePath });
        }
    }
}
