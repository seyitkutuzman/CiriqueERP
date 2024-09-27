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
    public class StockInOutController : ControllerBase
    {
        private readonly MasterContext _context;

        public StockInOutController(MasterContext context)
        {
            _context = context;
        }

        // GET: api/StockInOut
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockInOut>>> GetStockInOut()
        {
            return await _context.StockInOut.ToListAsync();
        }

        // GET: api/StockInOut/CompNo/{compNo}
        [HttpGet("CompNo/{compNo}")]
        public async Task<ActionResult<IEnumerable<StockInOut>>> GetStockInOutByCompNo(int compNo)
        {
            return await _context.StockInOut.Where(x => x.CompNo == compNo).ToListAsync();
        }

        // GET: api/StockInOut/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StockInOut>> GetStockInOut(int id)
        {
            var stockInOut = await _context.StockInOut.FindAsync(id);

            if (stockInOut == null)
            {
                return NotFound();
            }

            return stockInOut;
        }

        // POST: api/StockInOut
        [HttpPost]
        public async Task<ActionResult<StockInOut>> PostStockInOut(StockInOut stockInOut)
        {
            _context.StockInOut.Add(stockInOut);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStockInOut), new { id = stockInOut.StockInOutID }, stockInOut);
        }

        // PUT: api/StockInOut/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStockInOut(int id, StockInOut stockInOut)
        {
            if (id != stockInOut.StockInOutID)
            {
                return BadRequest();
            }

            _context.Entry(stockInOut).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StockInOutExists(id))
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

        // DELETE: api/StockInOut/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockInOut(int id)
        {
            var stockInOut = await _context.StockInOut.FindAsync(id);
            if (stockInOut == null)
            {
                return NotFound();
            }

            _context.StockInOut.Remove(stockInOut);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StockInOutExists(int id)
        {
            return _context.StockInOut.Any(e => e.StockInOutID == id);
        }
    }
}
