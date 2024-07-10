using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackOffice.Data;
using BackOffice.Models;
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

    [HttpPost("auth/login")]
    public IActionResult Login([FromBody] LoginModel model)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.UserCode == model.Username && u.UserPass == model.Password);

        if (user == null)
        {
            return Unauthorized(new { message = "User code or password is incorrect" });
        }

        // Giriş başarılı olduğunda token veya başka bir cevap döndürün
        return Ok(new { message = "Login successful" });
    }
}

public class LoginModel
{
    public string Username { get; set; }
    public string Password { get; set; }
}


