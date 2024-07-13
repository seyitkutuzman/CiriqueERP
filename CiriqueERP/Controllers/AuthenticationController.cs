using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CiriqueERP.Data;
using CiriqueERP.Models;

[Route("api/auth")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly MasterContext _context;

    public AuthenticationController(MasterContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel model)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.UserNo == model.userNo && u.UserPass == model.userPass);

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
    public int compNo { get; set; }
    public int userNo { get; set; }
    public string userPass { get; set; }
}


