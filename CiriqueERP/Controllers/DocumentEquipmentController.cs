using CiriqueERP.Data;
using CiriqueERP.Models; // DocumentEquipment modeli için gerekli
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentEquipmentController : ControllerBase
    {
        private readonly MasterContext _context;

        public DocumentEquipmentController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentEquipmentModel>>> GetDocumentEquipments()
        {
            return await _context.DocumentEquipments.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<DocumentEquipmentModel>> PostDocumentEquipment(DocumentEquipmentModel documentEquipment)
        {
            _context.DocumentEquipments.Add(documentEquipment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDocumentEquipments), new { id = documentEquipment.Id }, documentEquipment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocumentEquipment(int id, DocumentEquipmentModel documentEquipment)
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocumentEquipment(int id)
        {
            var documentEquipment = await _context.DocumentEquipments.FindAsync(id);
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
