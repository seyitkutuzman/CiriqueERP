using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CiriqueERP.Data;
using Microsoft.AspNetCore.Http;

[ApiController]
[Route("api/[controller]")]
public class ServiceReportsController : ControllerBase
{
    private readonly MasterContext _context;

    public ServiceReportsController(MasterContext context)
    {
        _context = context;
    }

[HttpGet("getServiceReports/{compNo}")]
public async Task<ActionResult<IEnumerable<ServiceReport>>> GetServiceReports(int compNo)
{
    var reports = await _context.ServiceReports.Where(p => p.compNo == compNo).ToListAsync();
    if (!reports.Any())
    {
        return NotFound(); // Eğer rapor bulunamazsa 404 döner
    }
    return reports;
}


    // GET: api/ServiceReports/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceReport>> GetServiceReport(int id)
    {
        var serviceReport = await _context.ServiceReports.FindAsync(id);

        if (serviceReport == null)
        {
            return NotFound();
        }

        return serviceReport;
    }

    // POST: api/ServiceReports
    [HttpPost]
    public async Task<ActionResult<ServiceReport>> PostServiceReport(ServiceReport serviceReport)
    {
        _context.ServiceReports.Add(serviceReport);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetServiceReport), new { id = serviceReport.ReportID }, serviceReport);
    }

    // PUT: api/ServiceReports/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutServiceReport(int id, ServiceReport serviceReport)
    {
        if (id != serviceReport.ReportID)
        {
            return BadRequest();
        }

        _context.Entry(serviceReport).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ServiceReportExists(id))
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

    // DELETE: api/ServiceReports/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteServiceReport(int id)
    {
        var serviceReport = await _context.ServiceReports.FindAsync(id);
        if (serviceReport == null)
        {
            return NotFound();
        }

        _context.ServiceReports.Remove(serviceReport);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/ServiceReports/upload/{id}
    [HttpPost("upload/{id}")]
    public async Task<IActionResult> UploadFile(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        if (!Directory.Exists(uploadsFolderPath))
        {
            Directory.CreateDirectory(uploadsFolderPath);
        }

        var filePath = Path.Combine(uploadsFolderPath, file.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var serviceReport = await _context.ServiceReports.FindAsync(id);
        if (serviceReport == null)
            return NotFound();

        serviceReport.DocumentFile = file.FileName;
        await _context.SaveChangesAsync();

        return Ok(new { Message = "File uploaded successfully." });
    }

// GET: api/ServiceReports/download/{fileName}
[HttpGet("download/{fileName}")]
public IActionResult DownloadFile(string fileName)
{
    var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
    var filePath = Path.Combine(uploadsFolderPath, fileName);

    if (!System.IO.File.Exists(filePath))
    {
        return NotFound();
    }

    var fileBytes = System.IO.File.ReadAllBytes(filePath);
    var mimeType = "application/octet-stream";
    return File(fileBytes, mimeType, fileName);
}



    private bool ServiceReportExists(int id)
    {
        return _context.ServiceReports.Any(e => e.ReportID == id);
    }
}
