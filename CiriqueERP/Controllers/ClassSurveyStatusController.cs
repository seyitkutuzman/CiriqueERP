using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO; // For Path
using System.Linq;
using System.Threading.Tasks;
using CiriqueERP.Data;
using CiriqueERP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting; // For IWebHostEnvironment

namespace CiriqueERP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassSurveyStatusController : ControllerBase
    {
        private readonly MasterContext _context;
        private readonly IWebHostEnvironment _environment;

        public ClassSurveyStatusController(MasterContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/ClassSurveyStatus/comp/{compNo}
        [HttpGet("comp/{compNo}")]
        public async Task<ActionResult<IEnumerable<ClassSurveyStatus>>> GetClassSurveyStatuses(int compNo)
        {
            var surveys = await _context.ClassSurveyStatus.Where(s => s.CompNo == compNo).ToListAsync();
            if (!surveys.Any())
            {
                return NotFound();
            }
            return surveys;
        }

        // GET: api/ClassSurveyStatus/details/{id}
        [HttpGet("details/{id}")]
        public async Task<ActionResult<ClassSurveyStatus>> GetClassSurveyStatus(int id)
        {
            var survey = await _context.ClassSurveyStatus.FindAsync(id);

            if (survey == null)
            {
                return NotFound();
            }

            return survey;
        }

        // POST: api/ClassSurveyStatus
        [HttpPost]
        public async Task<ActionResult<ClassSurveyStatus>> PostClassSurveyStatus(ClassSurveyStatus classSurveyStatus)
        {
            _context.ClassSurveyStatus.Add(classSurveyStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClassSurveyStatus), new { id = classSurveyStatus.SurveyID }, classSurveyStatus);
        }

        // PUT: api/ClassSurveyStatus/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClassSurveyStatus(int id, ClassSurveyStatus classSurveyStatus)
        {
            if (id != classSurveyStatus.SurveyID)
            {
                return BadRequest();
            }

            _context.Entry(classSurveyStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassSurveyStatusExists(id))
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

        // DELETE: api/ClassSurveyStatus/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassSurveyStatus(int id)
        {
            var classSurveyStatus = await _context.ClassSurveyStatus.FindAsync(id);
            if (classSurveyStatus == null)
            {
                return NotFound();
            }

            _context.ClassSurveyStatus.Remove(classSurveyStatus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/ClassSurveyStatus/upload/{id}
        [HttpPost("upload/{id}")]
        public async Task<IActionResult> UploadFile(int id, [FromForm] IFormFile file)
        {
            Console.WriteLine($"UploadFile called with id: {id}, file: {file?.FileName}");
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                var uploadsFolderPath = Path.Combine(_environment.ContentRootPath, "uploads");
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }

                var filePath = Path.Combine(uploadsFolderPath, file.FileName);
                Console.WriteLine($"Saving file to: {filePath}");

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var classSurveyStatus = await _context.ClassSurveyStatus.FindAsync(id);
                if (classSurveyStatus == null)
                    return NotFound();

                classSurveyStatus.DocumentPath = file.FileName;
                await _context.SaveChangesAsync();

                return Ok(new { Message = "File uploaded successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UploadFile: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error uploading file");
            }
        }

        // GET: api/ClassSurveyStatus/download/{fileName}
        [HttpGet("download/{fileName}")]
        public IActionResult DownloadFile(string fileName)
        {
            var uploadsFolderPath = Path.Combine(_environment.ContentRootPath, "uploads");
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"File {fileName} not found in {uploadsFolderPath}");
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var mimeType = "application/octet-stream";
            return File(fileBytes, mimeType, fileName);
        }

        private bool ClassSurveyStatusExists(int id)
        {
            return _context.ClassSurveyStatus.Any(e => e.SurveyID == id);
        }
    }
}
