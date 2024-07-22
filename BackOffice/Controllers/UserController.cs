using BackOffice.Data;
using BackOffice.Models;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace BackOffice.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController:ControllerBase
    {
        private readonly MasterContext _context;
        private readonly IConfiguration _configuration;

        public UserController(MasterContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpPost]
        [Route("AddUser")]
        public IActionResult AddUser([FromBody] Users user)
        {
            if (user == null)
            {
                return BadRequest("User is null.");
            }
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User added successfully.");
        }

    }
}
