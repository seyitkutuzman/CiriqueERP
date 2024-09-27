using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data;
using CiriqueERP.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockGeneralController : ControllerBase
    {
        private readonly MasterContext _context;

        public StockGeneralController(MasterContext context)
        {
            _context = context;
        }

        // GET: api/StockGeneral
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockGeneral>>> GetStockGeneral()
        {
            return await _context.StockGeneral.ToListAsync();
        }

        // GET: api/StockGeneral/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StockGeneral>> GetStockGeneral(int id)
        {
            var stockGeneral = await _context.StockGeneral.FindAsync(id);

            if (stockGeneral == null)
            {
                return NotFound();
            }

            return stockGeneral;
        }

        // GET: api/StockGeneral/compNo/{compNo}
[HttpGet("compNo/{compNo}")]
public async Task<ActionResult<IEnumerable<StockGeneral>>> GetStockGeneralByCompNo(int compNo)
{
    var stockGeneralList = await _context.StockGeneral.Where(s => s.compNo == compNo).ToListAsync();

    if (!stockGeneralList.Any())
    {
        return NotFound(); // No records found for the provided compNo
    }

    return stockGeneralList;
}

// POST: api/StockGeneral
[HttpPost]
public async Task<ActionResult<StockGeneral>> PostStockGeneral(StockGeneral stockGeneral)
{
    _context.StockGeneral.Add(stockGeneral);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetStockGeneral), new { id = stockGeneral.StockID }, stockGeneral);
}


        // PUT: api/StockGeneral/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStockGeneral(int id, StockGeneral stockGeneral)
        {
            if (id != stockGeneral.StockID)
            {
                return BadRequest();
            }

            _context.Entry(stockGeneral).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StockGeneralExists(id))
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

        // DELETE: api/StockGeneral/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockGeneral(int id)
        {
            var stockGeneral = await _context.StockGeneral.FindAsync(id);
            if (stockGeneral == null)
            {
                return NotFound();
            }

            _context.StockGeneral.Remove(stockGeneral);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StockGeneralExists(int id)
        {
            return _context.StockGeneral.Any(e => e.StockID == id);
        }
    }
}
