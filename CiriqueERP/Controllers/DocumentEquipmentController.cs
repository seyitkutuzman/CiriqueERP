using CiriqueERP.Data;
using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Controllers
{
    [Route("api/controller")]
    [ApiController]
    public class DocumentEquipmentController : ControllerBase
    {
        private readonly MasterContext _context;

        public DocumentEquipmentController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllDocEq/{compNo}")]
        public async Task<ActionResult<IEnumerable<DocumentEquipment>>> GetDocumentEquipments(int compNo)
        {
            return await _context.DocumentEquipments
                .Where(de => de.CompNo == compNo)
                .ToListAsync();
        }

        [HttpPost("AddDocEq")]
        public async Task<ActionResult<DocumentEquipment>> PostDocumentEquipment(DocumentEquipment documentEquipment)
        {
            _context.DocumentEquipments.Add(documentEquipment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDocumentEquipments), new { compNo = documentEquipment.CompNo, id = documentEquipment.Id }, documentEquipment);
        }

        [HttpPut("UpdateDocEq/{id}")]
        public async Task<IActionResult> PutDocumentEquipment(int id, DocumentEquipment documentEquipment)
        {
            if (id != documentEquipment.Id)
            {
                return BadRequest();
            }

            _context.Entry(documentEquipment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentEquipmentExists(id))
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

        [HttpDelete("DeleteDocEq/{id}")]
        public async Task<IActionResult> DeleteDocumentEquipment(int id, int compNo)
        {
            var documentEquipment = await _context.DocumentEquipments
                .Where(de => de.Id == id && de.CompNo == compNo)
                .FirstOrDefaultAsync();

            if (documentEquipment == null)
            {
                return NotFound();
            }

            _context.DocumentEquipments.Remove(documentEquipment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DocumentEquipmentExists(int id)
        {
            return _context.DocumentEquipments.Any(e => e.Id == id);
        }
    }
}
