using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data; // MasterContext'in olduğu namespace
using CiriqueERP.Models; // Modellerin olduğu namespace

namespace YourProjectNamespace.Controllers
{
    [Route("api/AuxiliaryEnginePerformanceDaily")]
    [ApiController]
    public class AuxiliaryEnginePerformanceController : ControllerBase
    {
        private readonly MasterContext _context;

        public AuxiliaryEnginePerformanceController(MasterContext context)
        {
            _context = context;
        }

        // Performans verilerini getiren metot
        // Tarih parametrelerini kaldırarak tüm kayıtları getirmeyi deneyin
        [HttpGet("getAuxiliary/{compNo}")]
        public async Task<ActionResult<IEnumerable<AuxiliaryEnginePerformance>>> GetAuxiliaryEnginePerformances(int compNo)
        {
            var performances = await _context.AuxiliaryEnginePerformancesDaily
                .Include(a => a.CylinderExhaustGasTemps)
                .Where(a => a.CompNo == compNo) // Sadece CompNo ile filtrele
                .ToListAsync();

            // Sonuçları kontrol etmek için konsola yazdırın
            Console.WriteLine($"Records found: {performances.Count}");

            return Ok(performances);
        }




        // Performans detayını getiren metot
        [HttpGet("{id}")]
        public async Task<ActionResult<AuxiliaryEnginePerformance>> GetAuxiliaryEnginePerformanceDetail(int id)
        {
            var performance = await _context.AuxiliaryEnginePerformancesDaily
                                            .Include(a => a.CylinderExhaustGasTemps)
                                            .FirstOrDefaultAsync(a => a.Id == id);

            if (performance == null)
            {
                return NotFound();
            }

            return performance;
        }

        // Performans verisini güncelleyen metot
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuxiliaryEnginePerformance(int id, AuxiliaryEnginePerformance performance)
        {
            if (id != performance.Id)
            {
                return BadRequest();
            }

            _context.Entry(performance).State = EntityState.Modified;

            // İlişkili CylinderExhaustGasTemps nesnelerini güncelleyin
            foreach (var cylinder in performance.CylinderExhaustGasTemps)
            {
                cylinder.AuxiliaryEnginePerformanceId = performance.Id; // Foreign Key ilişkisini ayarlıyoruz
                _context.Entry(cylinder).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuxiliaryEnginePerformanceExists(id))
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


        // Yeni performans verisi ekleyen metot
        [HttpPost]
        public async Task<ActionResult<AuxiliaryEnginePerformance>> PostAuxiliaryEnginePerformance(AuxiliaryEnginePerformance performance)
        {
            // Öncelikle performans nesnesini kaydedin
            _context.AuxiliaryEnginePerformancesDaily.Add(performance);
            await _context.SaveChangesAsync();

            // İlişkili CylinderExhaustGasTemps nesnelerini performansla ilişkilendirin
            foreach (var cylinder in performance.CylinderExhaustGasTemps)
            {
                cylinder.AuxiliaryEnginePerformanceId = performance.Id; // Foreign Key ilişkisini ayarlıyoruz
            }

            // CylinderExhaustGasTemps güncellemelerini kaydedin
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAuxiliaryEnginePerformanceDetail), new { id = performance.Id }, performance);
        }




        // Performans verisini silen metot
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuxiliaryEnginePerformance(int id)
        {
            var performance = await _context.AuxiliaryEnginePerformancesDaily.FindAsync(id);
            if (performance == null)
            {
                return NotFound();
            }

            _context.AuxiliaryEnginePerformancesDaily.Remove(performance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuxiliaryEnginePerformanceExists(int id)
        {
            return _context.AuxiliaryEnginePerformancesDaily.Any(e => e.Id == id);
        }
    }
}
