using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data;
using CiriqueERP.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace CiriqueERP.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly MasterContext _context;

        public JobController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("getJobs/{CompNo}")]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs(int CompNo)
        {
            return await _context.Jobs
                .Where(job => job.CompNo == CompNo)
                .ToListAsync();
        }

        [HttpPost("addJob")]
        public async Task<ActionResult<Job>> PostJob(Job job)
        {
            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJobs), new { CompNo = job.CompNo, id = job.Id }, job);
        }

        [HttpPut("updateJob/{id}")]
        public async Task<IActionResult> PutJob(int id, Job job)
        {
            if (id != job.Id || job.CompNo == 0)
            {
                return BadRequest();
            }

            _context.Entry(job).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Jobs.Any(e => e.Id == id))
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

        [HttpDelete("deleteJob/{id}/{CompNo}")]
        public async Task<IActionResult> DeleteJob(int id, int CompNo)
        {
            var job = await _context.Jobs
                .Where(job => job.Id == id && job.CompNo == CompNo)
                .FirstOrDefaultAsync();

            if (job == null)
            {
                return NotFound();
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("uploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Dosya yüklenmedi.");
            }

            // Projenin çalıştığı dizine göre uploads klasörüne yol oluşturma
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

            // Eğer uploads klasörü yoksa oluştur
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { filePath });
        }

        [HttpGet("downloadFile")]
        public ActionResult DownloadFile([FromQuery] string fileName)
        {
            // Sadece dosya adını kullanarak tam dosya yolunu oluşturma
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Dosya bulunamadı.");
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/octet-stream", fileName);
        }



    }
}
