using CiriqueERP.Data;
using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace CiriqueERP.Controllers
{
    [Route("api/controller")]
    [ApiController]
    public class DocumentSectionController : ControllerBase
    {
        private readonly MasterContext _context;

        public DocumentSectionController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllDocSections/{compNo}")]
        public async Task<ActionResult<IEnumerable<DocumentSection>>> GetDocumentSections(int compNo)
        {
            return await _context.DocumentSections.Where(ds => ds.compNo == compNo).ToListAsync();
        }

        [HttpPost("AddDocSection")]
        public async Task<ActionResult<DocumentSection>> PostDocumentSection(DocumentSection documentSection)
        {
            _context.DocumentSections.Add(documentSection);
            await _context.SaveChangesAsync();
            return Created($"/api/controller/GetAllDocSections/{documentSection.Id}", documentSection);
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

        [HttpDelete("DeleteDocSection/{id}/{compNo}")]
        public async Task<IActionResult> DeleteDocumentSection(int id, int compNo)
        {
            var documentSection = await _context.DocumentSections
                .Where(ds => ds.Id == id && ds.compNo == compNo)
                .FirstOrDefaultAsync();

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
