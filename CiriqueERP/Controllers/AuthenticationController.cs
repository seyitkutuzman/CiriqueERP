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
            .Where(u => u.CompNo == model.compNo && u.UserNo == model.userNo && u.UserPass == model.userPass)
            .Select(u => new
            {
                u.CompNo,
                u.UserNo,
                u.UserPass,
                u.Departmant,
                u.CreateDate,
                u.ModifyDate,
                u.IsActive,
                u.name,
                u.surname
            })
            .FirstOrDefault();

        if (user == null)
        {
            return Unauthorized(new { message = "User code or password is incorrect" });
        }

        return Ok(user);
    }
}


public class LoginModel
{
    public int compNo { get; set; }
    public int userNo { get; set; }
    public string userPass { get; set; }
}


