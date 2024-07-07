using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackOffice.Data;
using BackOffice.BoModels;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthenticationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("loginBO")]
    public async Task<IActionResult> Login([FromBody] LoginModel login)
    {
        var user = await _context.Users
            .SingleOrDefaultAsync(u => u.userCode == login.Username && u.userPass == login.Password);

        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(new { Success = true, Username = user.userCode });
    }
}

public class LoginModel
{
    public string Username { get; set; }
    public string Password { get; set; }
}

namespace BackOffice.Controllers
{
    public class AuthenticationController
    {
    }
}
