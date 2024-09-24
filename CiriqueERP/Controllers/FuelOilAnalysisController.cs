using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CiriqueERP.Data;

[ApiController]
[Route("api/[controller]")]
public class FuelOilAnalysisController : ControllerBase
{
    private readonly MasterContext _context;

    public FuelOilAnalysisController(MasterContext context)
    {
        _context = context;
    }

    // GET: api/FuelOilAnalysis
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FuelOilAnalysis>>> GetFuelOilAnalyses()
    {
        return await _context.FuelOilAnalysis.ToListAsync();
    }

    // GET: api/FuelOilAnalysis/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FuelOilAnalysis>> GetFuelOilAnalysis(int id)
    {
        var fuelOilAnalysis = await _context.FuelOilAnalysis.FindAsync(id);

        if (fuelOilAnalysis == null)
        {
            return NotFound();
        }

        return fuelOilAnalysis;
    }

    // POST: api/FuelOilAnalysis
    [HttpPost]
    public async Task<ActionResult<FuelOilAnalysis>> PostFuelOilAnalysis(FuelOilAnalysis fuelOilAnalysis)
    {
        _context.FuelOilAnalysis.Add(fuelOilAnalysis);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFuelOilAnalysis), new { id = fuelOilAnalysis.ReportID }, fuelOilAnalysis);
    }

    // PUT: api/FuelOilAnalysis/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutFuelOilAnalysis(int id, FuelOilAnalysis fuelOilAnalysis)
    {
        if (id != fuelOilAnalysis.ReportID)
        {
            return BadRequest();
        }

        _context.Entry(fuelOilAnalysis).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FuelOilAnalysisExists(id))
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

[HttpPost("upload/{id}")]
public async Task<IActionResult> UploadFile(int id, IFormFile file)
{
    if (file == null || file.Length == 0)
        return BadRequest("No file uploaded");

    // Dosyayı projenin içindeki "Uploads" klasörüne kaydedelim
    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

    // Eğer klasör yoksa oluşturalım
    if (!Directory.Exists(uploadsFolder))
    {
        Directory.CreateDirectory(uploadsFolder);
    }

    // Güvenli dosya adı alalım
    var safeFileName = Path.GetFileName(file.FileName);
    var filePath = Path.Combine(uploadsFolder, safeFileName);

    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    // ID'ye göre dosyanın ilişkili olduğu kaydı güncelleme
    var analysis = await _context.FuelOilAnalysis.FindAsync(id);
    if (analysis == null)
        return NotFound();

    analysis.DocumentFile = safeFileName; // Sadece dosya adını kaydediyoruz
    await _context.SaveChangesAsync();

    return Ok(new { Message = "File uploaded successfully." });
}



    // DELETE: api/FuelOilAnalysis/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFuelOilAnalysis(int id)
    {
        var fuelOilAnalysis = await _context.FuelOilAnalysis.FindAsync(id);
        if (fuelOilAnalysis == null)
        {
            return NotFound();
        }

        _context.FuelOilAnalysis.Remove(fuelOilAnalysis);
        await _context.SaveChangesAsync();

        return NoContent();
    }

[HttpGet("download/{fileName}")]
public IActionResult DownloadFile(string fileName)
{
    // Güvenli dosya adı alalım
    var safeFileName = Path.GetFileName(fileName);

    // Dosyanın sunucuda bulunduğu yolu tanımlayın
    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
    var uniqueFileName = Guid.NewGuid().ToString() + "_" + safeFileName;
    var filePath = Path.Combine(uploadsFolder, safeFileName);

    if (!System.IO.File.Exists(filePath))
    {
        return NotFound();
    }

    var mimeType = "application/octet-stream";
    var fileBytes = System.IO.File.ReadAllBytes(filePath);
    return File(fileBytes, mimeType, safeFileName);
}


    private bool FuelOilAnalysisExists(int id)
    {
        return _context.FuelOilAnalysis.Any(e => e.ReportID == id);
    }
}
