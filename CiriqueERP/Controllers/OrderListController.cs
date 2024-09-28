using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CiriqueERP.Data;
using CiriqueERP.Models;

namespace CiriqueERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderListController : ControllerBase
    {
        private readonly MasterContext _context;

        public OrderListController(MasterContext context)
        {
            _context = context;
        }

        // GET: api/OrderList
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderList>>> GetOrderList()
        {
            return await _context.OrderList.ToListAsync();
        }

        // GET: api/OrderList/compNo/{compNo}
        [HttpGet("compNo/{compNo}")]
        public async Task<ActionResult<IEnumerable<OrderList>>> GetOrderListByCompNo(int compNo)
        {
            var orderList = await _context.OrderList.Where(o => o.CompNo == compNo).ToListAsync();

            if (orderList == null)
            {
                return NotFound();
            }

            return orderList;
        }

        // GET: api/OrderList/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderList>> GetOrderList(int id)
        {
            var orderList = await _context.OrderList.FindAsync(id);

            if (orderList == null)
            {
                return NotFound();
            }

            return orderList;
        }

        // POST: api/OrderList
        [HttpPost]
        public async Task<ActionResult<OrderList>> PostOrderList(OrderList orderList)
        {
            _context.OrderList.Add(orderList);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderList), new { id = orderList.OrderID }, orderList);
        }

        // PUT: api/OrderList/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderList(int id, OrderList orderList)
        {
            if (id != orderList.OrderID)
            {
                return BadRequest();
            }

            _context.Entry(orderList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderListExists(id))
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

        // DELETE: api/OrderList/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderList(int id)
        {
            var orderList = await _context.OrderList.FindAsync(id);
            if (orderList == null)
            {
                return NotFound();
            }

            _context.OrderList.Remove(orderList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderListExists(int id)
        {
            return _context.OrderList.Any(e => e.OrderID == id);
        }
    }
}
