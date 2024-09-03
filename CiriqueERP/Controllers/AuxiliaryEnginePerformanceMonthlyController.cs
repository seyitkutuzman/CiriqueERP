using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data; 

namespace CiriqueERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuxiliaryEnginePerformanceMonthlyController : ControllerBase
    {
        private readonly MasterContext _context;

        public AuxiliaryEnginePerformanceMonthlyController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("getAuxiliary/{compNo}")]
        public async Task<ActionResult<IEnumerable<AuxiliaryEnginePerformanceMonthly>>> GetPerformances(int compNo, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _context.AuxiliaryEnginePerformanceMonthly
                .Include(a => a.CylinderExhaustGasTemps)
                .Where(a => a.CompNo == compNo && a.FormDate >= startDate && a.FormDate <= endDate)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuxiliaryEnginePerformanceMonthly>> GetPerformanceDetail(int id)
        {
            var performance = await _context.AuxiliaryEnginePerformanceMonthly
                .Include(a => a.CylinderExhaustGasTemps)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (performance == null)
            {
                return NotFound();
            }

            return performance;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePerformance(int id, AuxiliaryEnginePerformanceMonthly performance)
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
                if (!_context.AuxiliaryEnginePerformanceMonthly.Any(e => e.Id == id))
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

[HttpPost]
public async Task<ActionResult<AuxiliaryEnginePerformanceMonthly>> AddPerformance(AuxiliaryEnginePerformanceMonthly performance)
{
    var newPerformance = new AuxiliaryEnginePerformanceMonthly
    {
        Vessel = performance.Vessel,
        Personnel = performance.Personnel,
        EngineNo = performance.EngineNo,
        FormDate = performance.FormDate,
        PresentSpeed = performance.PresentSpeed,
        TotalRunningHours = performance.TotalRunningHours,
        SW_Temperature = performance.SW_Temperature,
        FuelViscosity = performance.FuelViscosity,
        FuelEngInletTemp = performance.FuelEngInletTemp,
        FuelPressure = performance.FuelPressure,
        MeanScavAirPress = performance.MeanScavAirPress,
        EngineLoad = performance.EngineLoad,
        MainScavExhAirTemp = performance.MainScavExhAirTemp,
        EngineKW = performance.EngineKW,
        CylCoolingWaterTemp = performance.CylCoolingWaterTemp,
        CylCoolingWaterPress = performance.CylCoolingWaterPress,
        CylLuboilTemp = performance.CylLuboilTemp,
        CylLuboilPress = performance.CylLuboilPress,
        OilConsTonsPerDay = performance.OilConsTonsPerDay,
        CompNo = performance.CompNo,
        CylinderExhaustGasTemps = performance.CylinderExhaustGasTemps
            .Select(cylinder => new CylinderExhaustGasTempMonthly
            {
                CylinderNo = cylinder.CylinderNo,
                PMax = cylinder.PMax,
                PComp = cylinder.PComp,
                ExhGasTemp = cylinder.ExhGasTemp,
                FPumpRackInd = cylinder.FPumpRackInd,
                AuxiliaryEnginePerformanceId = cylinder.AuxiliaryEnginePerformanceId
            }).ToList()
    };

    _context.AuxiliaryEnginePerformanceMonthly.Add(newPerformance);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetPerformanceDetail), new { id = newPerformance.Id }, newPerformance);
}













        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerformance(int id)
        {
            var performance = await _context.AuxiliaryEnginePerformanceMonthly.FindAsync(id);
            if (performance == null)
            {
                return NotFound();
            }

            _context.AuxiliaryEnginePerformanceMonthly.Remove(performance);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
