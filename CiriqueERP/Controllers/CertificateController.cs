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

        [HttpGet("GetAllCertificates/{compNo}")]
        public async Task<ActionResult<IEnumerable<Certificate>>> GetAllCertificates(int compNo)
        {
            return await _context.Certificates.Where(c => c.compNo == compNo).ToListAsync();
        }

        [HttpPost("AddCertificate")]
        public async Task<ActionResult<Certificate>> AddCertificate(Certificate certificate)
        {

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllCertificates), new { id = certificate.Id, compNo = certificate.compNo }, certificate);
        }

        [HttpPut("UpdateCertificate/{id}")]
        public async Task<IActionResult> UpdateCertificate(int id, Certificate certificate)
        {
            if (id != certificate.Id)
            {
                return BadRequest();
            }

            // Kullanıcının departmanını kontrol edin
            var departmentId = User.Claims.FirstOrDefault(c => c.Type == "Departmant")?.Value;

            if (departmentId != "2" && departmentId != "3")
            {
                return Forbid("You do not have permission to update this certificate.");
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

        [HttpDelete("DeleteCertificate/{id}/{compNo}")]
        public async Task<IActionResult> DeleteCertificate(int id, int compNo)
        {
            var certificate = await _context.Certificates
                .Where(c => c.Id == id && c.compNo == compNo)
                .FirstOrDefaultAsync();

            if (certificate == null)
            {
                return NotFound();
            }

            // Kullanıcının departmanını kontrol edin
            var departmentId = User.Claims.FirstOrDefault(c => c.Type == "Departmant")?.Value;

            if (departmentId != "2" && departmentId != "3")
            {
                return Forbid("You do not have permission to delete this certificate.");
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
