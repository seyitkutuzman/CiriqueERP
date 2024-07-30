using CiriqueERP.Data;
using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CiriqueERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentSectionController : ControllerBase
    {
        private readonly MasterContext _context;

        public DocumentSectionController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllDocSections")]
        public async Task<ActionResult<IEnumerable<DocumentSection>>> GetDocumentSections()
        {
            return await _context.DocumentSections.ToListAsync();
        }

        [HttpPost("AddDocSection")]
        public async Task<ActionResult<DocumentSection>> PostDocumentSection(DocumentSection documentSection)
        {
            _context.DocumentSections.Add(documentSection);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDocumentSections), new { id = documentSection.Id }, documentSection);
        }

        [HttpPut("UpdateDocSection/{id}")]
        public async Task<IActionResult> PutDocumentSection(int id, DocumentSection documentSection)
        {
            if (id != documentSection.Id)
            {
                return BadRequest();
            }

            _context.Entry(documentSection).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentSectionExists(id))
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

        [HttpDelete("DeleteDocSection/{id}")]
        public async Task<IActionResult> DeleteDocumentSection(int id)
        {
            var documentSection = await _context.DocumentSections.FindAsync(id);
            if (documentSection == null)
            {
                return NotFound();
            }

            _context.DocumentSections.Remove(documentSection);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DocumentSectionExists(int id)
        {
            return _context.DocumentSections.Any(e => e.Id == id);
        }
    }
}
