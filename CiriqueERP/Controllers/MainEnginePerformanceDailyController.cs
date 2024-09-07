    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CiriqueERP.Data; // Doğru namespace'i kullandığınızdan emin olun.

    [Route("api/enginePerformanceDaily")]
    [ApiController]
    public class MainEnginePerformanceDailyController : ControllerBase
    {
        private readonly MasterContext _context;

        public MainEnginePerformanceDailyController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MainEnginePerformanceDaily>>> GetPerformances()
        {
            return await _context.MainEnginePerformanceDaily
                                .Include(p => p.CylinderExhaustGasTemps)
                                .ToListAsync();
        }

        [HttpGet("get/{compNo}")]
        public async Task<ActionResult<MainEnginePerformanceDaily>> GetPerformance(int compNo)
        {
    var performances = await _context.MainEnginePerformanceDaily
                                     .Include(p => p.CylinderExhaustGasTemps)
                                     .Where(p => p.compNo == compNo) // compNo'ya göre filtreleme
                                     .ToListAsync();

    if (!performances.Any())
    {
        return NotFound("No performances found for the provided compNo.");
    }

    return Ok(performances);
        }

[HttpPost("addPerformance")]
public async Task<ActionResult<MainEnginePerformanceDaily>> AddPerformance(MainEnginePerformanceDaily performance)
{
    var newPerformance = new MainEnginePerformanceDaily
    {
        VesselName = performance.VesselName,
        Personnel = performance.Personnel,
        EngineNo = performance.EngineNo,
        FormDate = performance.FormDate,
        AverageSpeedTC = performance.AverageSpeedTC,
        FuelPressure = performance.FuelPressure,
        MeanScavAirPress = performance.MeanScavAirPress,
        EngineLoad = performance.EngineLoad,
        TCExhInletTemp = performance.TCExhInletTemp,
        TCExhOutletTemp = performance.TCExhOutletTemp,
        EngineKW = performance.EngineKW,
        CoolingWaterTemp = performance.CoolingWaterTemp,
        LuboilTemp = performance.LuboilTemp,
        CoolingWaterPress = performance.CoolingWaterPress,
        LuboilPress = performance.LuboilPress,
        compNo = performance.compNo,
        CylinderExhaustGasTemps = performance.CylinderExhaustGasTemps
            .Select(cylinder => new CylinderExhaustGasTempMainEngine
            {
                CylinderNo = cylinder.CylinderNo,
                ExhaustGasTemp = cylinder.ExhaustGasTemp
            }).ToList()
    };

    _context.MainEnginePerformanceDaily.Add(newPerformance);
    await _context.SaveChangesAsync();

    // Burada compNo parametresini sağladığınızdan emin olun
    return CreatedAtAction(nameof(GetPerformance), new { compNo = newPerformance.compNo }, newPerformance);
}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePerformance(int id, MainEnginePerformanceDaily performance)
        {
            if (id != performance.Id)
            {
                return BadRequest();
            }

            _context.Entry(performance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PerformanceExists(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerformance(int id)
        {
            var performance = await _context.MainEnginePerformanceDaily.FindAsync(id);
            if (performance == null)
            {
                return NotFound();
            }

            _context.MainEnginePerformanceDaily.Remove(performance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PerformanceExists(int id)
        {
            return _context.MainEnginePerformanceDaily.Any(e => e.Id == id);
        }
    }
