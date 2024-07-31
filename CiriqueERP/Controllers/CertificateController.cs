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
    public class CertificateController : ControllerBase
    {
        private readonly MasterContext _context;

        public CertificateController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllCertificates")]
        public async Task<ActionResult<IEnumerable<Certificate>>> GetAllCertificates()
        {
            return await _context.Certificates.ToListAsync();
        }

        [HttpPost("AddCertificate")]
        public async Task<ActionResult<Certificate>> AddCertificate(Certificate certificate)
        {
            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllCertificates), new { id = certificate.Id }, certificate);
        }

        [HttpPut("UpdateCertificate/{id}")]
        public async Task<IActionResult> UpdateCertificate(int id, Certificate certificate)
        {
            if (id != certificate.Id)
            {
                return BadRequest();
            }

            _context.Entry(certificate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CertificateExists(id))
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

        [HttpDelete("DeleteCertificate/{id}")]
        public async Task<IActionResult> DeleteCertificate(int id)
        {
            var certificate = await _context.Certificates.FindAsync(id);
            if (certificate == null)
            {
                return NotFound();
            }

            _context.Certificates.Remove(certificate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CertificateExists(int id)
        {
            return _context.Certificates.Any(e => e.Id == id);
        }
    }
}
