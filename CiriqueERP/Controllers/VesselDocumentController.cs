using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Threading.Tasks;
using CiriqueERP.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.Linq;

namespace CiriqueERP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VesselDocumentsController : ControllerBase
    {
        private readonly MasterContext _context;
        private readonly IWebHostEnvironment _environment;

        public VesselDocumentsController(MasterContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/VesselDocuments/{compNo}
        [HttpGet("{compNo}")]
        public async Task<ActionResult<IEnumerable<VesselDocument>>> GetVesselDocuments(int compNo)
        {
            var documents = await _context.VesselDocuments.Where(d => d.CompNo == compNo).ToListAsync();
            if (!documents.Any())
            {
                return NotFound(); // Returns 404 if no documents are found
            }
            return documents;
        }

        // GET: api/VesselDocuments/details/{id}
        [HttpGet("details/{id}")]
        public async Task<ActionResult<VesselDocument>> GetVesselDocument(int id)
        {
            var document = await _context.VesselDocuments.FindAsync(id);

            if (document == null)
            {
                return NotFound();
            }

            return document;
        }

        // POST: api/VesselDocuments
        [HttpPost]
        public async Task<ActionResult<VesselDocument>> PostVesselDocument(VesselDocument vesselDocument)
        {
            _context.VesselDocuments.Add(vesselDocument);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVesselDocument), new { id = vesselDocument.DocumentID }, vesselDocument);
        }

        // PUT: api/VesselDocuments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVesselDocument(int id, VesselDocument vesselDocument)
        {
            if (id != vesselDocument.DocumentID)
            {
                return BadRequest();
            }

            _context.Entry(vesselDocument).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VesselDocumentExists(id))
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

        // DELETE: api/VesselDocuments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVesselDocument(int id)
        {
            var vesselDocument = await _context.VesselDocuments.FindAsync(id);
            if (vesselDocument == null)
            {
                return NotFound();
            }

            _context.VesselDocuments.Remove(vesselDocument);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/VesselDocuments/upload/{id}
        [HttpPost("upload/{id}")]
public async Task<IActionResult> UploadFile(int id, [FromForm] IFormFile file)
{
    if (file == null || file.Length == 0)
        return BadRequest("No file uploaded");

    // Use ContentRootPath to get the application's root folder
    var uploadsFolderPath = Path.Combine(_environment.ContentRootPath, "uploads");
    Console.WriteLine($"Uploads folder path: {uploadsFolderPath}");

    if (!Directory.Exists(uploadsFolderPath))
    {
        try
        {
            Directory.CreateDirectory(uploadsFolderPath);
            Console.WriteLine("Uploads directory created successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating directory: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error creating directory");
        }
    }
    else
    {
        Console.WriteLine("Uploads directory already exists.");
    }

    var filePath = Path.Combine(uploadsFolderPath, file.FileName);

    try
    {
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
            Console.WriteLine("File saved successfully.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error saving file: {ex.Message}");
        return StatusCode(StatusCodes.Status500InternalServerError, "Error saving file");
    }

    var vesselDocument = await _context.VesselDocuments.FindAsync(id);
    if (vesselDocument == null)
        return NotFound("Vessel document not found");

    // Save the relative path to the database
    vesselDocument.FilePath = Path.Combine("uploads", file.FileName);
    await _context.SaveChangesAsync();

    return Ok(new { Message = "File uploaded successfully." });
}

[HttpGet("download/{fileName}")]
public IActionResult DownloadFile(string fileName)
{
    // Ensure fileName is safe
    var safeFileName = Path.GetFileName(fileName);

    var uploadsFolderPath = Path.Combine(_environment.ContentRootPath, "uploads");
    var filePath = Path.Combine(uploadsFolderPath, safeFileName);

    Console.WriteLine($"Trying to download file from: {filePath}");

    if (!System.IO.File.Exists(filePath))
    {
        Console.WriteLine($"File {safeFileName} not found in {uploadsFolderPath}");
        return NotFound($"File {safeFileName} not found in {uploadsFolderPath}");
    }

    var fileBytes = System.IO.File.ReadAllBytes(filePath);
    var mimeType = "application/octet-stream"; // Adjust as needed
    return File(fileBytes, mimeType, safeFileName);
}




        // Helper method to check if a VesselDocument exists
        private bool VesselDocumentExists(int id)
        {
            return _context.VesselDocuments.Any(e => e.DocumentID == id);
        }
    }
}
