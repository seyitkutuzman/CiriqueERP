using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CiriqueERP.Data;

namespace CiriqueERP.Controllers
{
    [Route("api/controller")]
    [ApiController]
    public class DocumentTypeController : ControllerBase
    {
        private readonly MasterContext _context;

        public DocumentTypeController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllDocTypes/{compNo}")]
        public async Task<ActionResult<IEnumerable<DocumentTypes>>> GetDocumentTypes(int compNo)
        {
            return await _context.DocumentTypes.Where(dt => dt.compNo == compNo).ToListAsync();
        }

        [HttpPost("AddDocType")]
        public async Task<ActionResult<DocumentTypes>> PostDocumentType(DocumentTypes documentType)
        {
            _context.DocumentTypes.Add(documentType);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDocumentTypes), new { id = documentType.Id, compNo = documentType.compNo }, documentType);
        }

        [HttpPut("UpdateDocType/{id}/{compNo}")]
        public async Task<IActionResult> PutDocumentType(int id, int compNo, DocumentTypes documentType)
        {
            if (id != documentType.Id || compNo != documentType.compNo)
            {
                return BadRequest();
            }

            _context.Entry(documentType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentTypeExists(id))
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

        [HttpDelete("DeleteDocType/{id}/{compNo}")]
        public async Task<IActionResult> DeleteDocumentType(int id, int compNo)
        {
            var documentType = await _context.DocumentTypes
                .Where(dt => dt.Id == id && dt.compNo == compNo)
                .FirstOrDefaultAsync();

            if (documentType == null)
            {
                return NotFound();
            }

            _context.DocumentTypes.Remove(documentType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DocumentTypeExists(int id)
        {
            return _context.DocumentTypes.Any(e => e.Id == id);
        }
    }
}
