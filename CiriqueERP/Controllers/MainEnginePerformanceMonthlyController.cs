using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CiriqueERP.Data;
using CiriqueERP.Models;

namespace CiriqueERP.Controllers
{
    [Route("api/mainEnginePerformanceMonthly")]
    [ApiController]
    public class MainEnginePerformanceMonthlyController : ControllerBase
    {
        private readonly MasterContext _context;

        public MainEnginePerformanceMonthlyController(MasterContext context)
        {
            _context = context;
        }

        [HttpGet("get/{compNo}")]
        public async Task<ActionResult<IEnumerable<MainEnginePerformanceMonthly>>> GetPerformances(int compNo)
        {
            return await _context.MainEnginePerformanceMonthly
                                .Include(p => p.CylinderExhaustGasTemps)
                                .Where(p => p.CompNo == compNo)
                                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MainEnginePerformanceMonthly>> GetPerformance(int id)
        {
            var performance = await _context.MainEnginePerformanceMonthly
                                            .Include(p => p.CylinderExhaustGasTemps)
                                            .FirstOrDefaultAsync(p => p.Id == id);

            if (performance == null)
            {
                return NotFound();
            }

            return performance;
        }

[HttpPost("addPerformance")]
public async Task<ActionResult<MainEnginePerformanceMonthly>> AddPerformance(MainEnginePerformanceMonthly performance)
{
    // Step 1: Declare and initialize newPerformance without assigning child entities
    var newPerformance = new MainEnginePerformanceMonthly
    {
        VesselName = performance.VesselName,
        FormDate = performance.FormDate,
        Personnel = performance.Personnel,
        EngineNo = performance.EngineNo,
        CylinderConstantRpm = performance.CylinderConstantRpm,
        SpeedRpm = performance.SpeedRpm,
        PresentSpeed = performance.PresentSpeed,
        TotalRunningHours = performance.TotalRunningHours,
        PropellerPitch = performance.PropellerPitch,
        TheoreticalShipSpeed = performance.TheoreticalShipSpeed,
        VesselCondition = performance.VesselCondition,
        Sea = performance.Sea,
        EngineRoomTemp = performance.EngineRoomTemp,
        SW_Temperature = performance.SW_Temperature,
        Draft_FW_AFT = performance.Draft_FW_AFT,
        Displacement = performance.Displacement,
        WindWindDirection = performance.WindWindDirection,
        ActualShipSpeed = performance.ActualShipSpeed,
        ShipSlip = performance.ShipSlip,
        ShipRoute = performance.ShipRoute,
        FuelLevel = performance.FuelLevel,
        GovernorSpeed = performance.GovernorSpeed,
        SpeedSetting = performance.SpeedSetting,
        AverageSpeedME = performance.AverageSpeedME,
        AverageSpeedTC = performance.AverageSpeedTC,
        FuelConsDuring = performance.FuelConsDuring,
        FuelDensity = performance.FuelDensity,
        FuelViscosity = performance.FuelViscosity,
        FuelEngInletTemp = performance.FuelEngInletTemp,
        MeanScavAirPress = performance.MeanScavAirPress,
        ChangeAirTempBefore = performance.ChangeAirTempBefore,
        ChangeAirTempAfter = performance.ChangeAirTempAfter,
        EngineLoad = performance.EngineLoad,
        TCExhInletTemp = performance.TCExhInletTemp,
        TCExhOutletTemp = performance.TCExhOutletTemp,
        CylCoolingWaterTemp = performance.CylCoolingWaterTemp,
        CylCoolingWaterPress = performance.CylCoolingWaterPress,
        CylLuboilTemp = performance.CylLuboilTemp,
        CylLuboilPress = performance.CylLuboilPress,
        OilConsTonsPerDay = performance.OilConsTonsPerDay,
        EngineKW = performance.EngineKW,
        CompNo = performance.CompNo
    };

    // Step 2: Assign the CylinderExhaustGasTemps and set the reference to newPerformance
    newPerformance.CylinderExhaustGasTemps = performance.CylinderExhaustGasTemps.Select(cylinder => new CylinderExhaustGasTempMainEngineMonthly
    {
        CylinderNo = cylinder.CylinderNo,
        PMax = cylinder.PMax,
        PComp = cylinder.PComp,
        ExhGasTemp = cylinder.ExhGasTemp,
        FPumpRackInd = cylinder.FPumpRackInd,
        VET = cylinder.VET,
        MainEnginePerformanceMonthly = newPerformance // Reference after declaration
    }).ToList();

    // Step 3: Add newPerformance to the context and save changes
    _context.MainEnginePerformanceMonthly.Add(newPerformance);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetPerformance), new { id = newPerformance.Id }, newPerformance);
}


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePerformance(int id, MainEnginePerformanceMonthly performance)
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
            var performance = await _context.MainEnginePerformanceMonthly.FindAsync(id);
            if (performance == null)
            {
                return NotFound();
            }

            _context.MainEnginePerformanceMonthly.Remove(performance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PerformanceExists(int id)
        {
            return _context.MainEnginePerformanceMonthly.Any(e => e.Id == id);
        }
    }
}
