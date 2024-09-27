using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data;
using CiriqueERP.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace CiriqueERP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockInventoryController : ControllerBase
    {
        private readonly MasterContext _context;

        public StockInventoryController(MasterContext context)
        {
            _context = context;
        }

        // GET: api/StockInventory/{compNo}
        [HttpGet("{compNo}")]
        public async Task<ActionResult<IEnumerable<StockInventory>>> GetStockInventoryByCompNo(int compNo)
        {
            var stockInventoryList = await _context.StockInventory
                .Where(s => s.CompNo == compNo)
                .ToListAsync();
                
            if (!stockInventoryList.Any())
            {
                return NotFound();
            }

            return stockInventoryList;
        }

        // GET: api/StockInventory/details/{id}
        [HttpGet("details/{id}")]
        public async Task<ActionResult<StockInventory>> GetStockInventoryById(int id)
        {
            var stockInventory = await _context.StockInventory.FindAsync(id);

            if (stockInventory == null)
            {
                return NotFound();
            }

            return stockInventory;
        }

        // POST: api/StockInventory
        [HttpPost]
        public async Task<ActionResult<StockInventory>> PostStockInventory(StockInventory stockInventory)
        {
            _context.StockInventory.Add(stockInventory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStockInventoryById), new { id = stockInventory.StockInventoryID }, stockInventory);
        }

        // PUT: api/StockInventory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStockInventory(int id, StockInventory stockInventory)
        {
            if (id != stockInventory.StockInventoryID)
            {
                return BadRequest();
            }

            _context.Entry(stockInventory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StockInventoryExists(id))
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

        // DELETE: api/StockInventory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockInventory(int id)
        {
            var stockInventory = await _context.StockInventory.FindAsync(id);
            if (stockInventory == null)
            {
                return NotFound();
            }

            _context.StockInventory.Remove(stockInventory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StockInventoryExists(int id)
        {
            return _context.StockInventory.Any(e => e.StockInventoryID == id);
        }
    }
}
