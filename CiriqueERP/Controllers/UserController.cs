using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CiriqueERP.Data;
using CiriqueERP.Models;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CiriqueERP.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MasterContext _context;

        public UserController(MasterContext context)
        {
            _context = context;
        }


        [HttpGet("getUsers")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            // Kullanıcının token'dan gelen CompNo'sunu alıyoruz
            var compNo = int.Parse(User.FindFirst("CompNo").Value);

            var users = await _context.Users.Where(u => u.CompNo == compNo).ToListAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult<Users>> AddUser(Users user)
        {
            var compNo = int.Parse(User.FindFirst("CompNo").Value);
            var departmant = int.Parse(User.FindFirst("Departmant").Value);

            // Kullanıcının yetkisinin olup olmadığını kontrol ediyoruz
            if (departmant != 2 && departmant != 3)
            {
                return Forbid("You don't have permission to add users.");
            }

            user.CompNo = compNo; // CompNo'yu token'dan alıyoruz

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.UserNo }, user);
        }

        [HttpDelete("useradd/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var compNo = int.Parse(User.FindFirst("CompNo").Value);
            var departmant = int.Parse(User.FindFirst("Departmant").Value);

            if (departmant != 2 && departmant != 3)
            {
                return Forbid("You don't have permission to delete users.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserNo == id && u.CompNo == compNo);
            if (user == null)
            {
                return NotFound("User not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
