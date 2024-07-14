using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CiriqueERP.Data;
using CiriqueERP.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

[Route("api/auth")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly MasterContext _context;
    private readonly IConfiguration _configuration;
    public AuthenticationController(MasterContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
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
        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();

        return Ok(new
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        });
    }

    private string GenerateAccessToken(dynamic user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        if (key == null || key.Length == 0)
        {
            throw new ArgumentNullException(nameof(key), "JWT key is not configured");
        }

        var claims = new List<Claim>
    {
        new Claim("CompNo", user.CompNo.ToString() ?? string.Empty),
        new Claim("UserNo", user.UserNo.ToString() ?? string.Empty),
        new Claim("UserPass", user.UserPass.ToString() ?? string.Empty),
        new Claim("Departmant", user.Departmant.ToString() ?? string.Empty)
    };

        // Optional fields with null checks
        if (user.CreateDate != null)
        {
            claims.Add(new Claim("CreateDate", user.CreateDate.ToString()));
        }
        if (user.ModifyDate != null)
        {
            claims.Add(new Claim("ModifyDate", user.ModifyDate.ToString()));
        }
        if (user.IsActive != null)
        {
            claims.Add(new Claim("IsActive", user.IsActive.ToString()));
        }
        if (user.name != null)
        {
            claims.Add(new Claim("name", user.name.ToString()));
        }
        if (user.name != null)
        {
            claims.Add(new Claim("surname", user.surname.ToString()));
        }


        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(2), // Access token süresi
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);

    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] TokenModel tokenModel)
    {
        var principal = GetPrincipalFromExpiredToken(tokenModel.AccessToken);
        var username = principal.Identity.Name; // Bu örnek için username'i aldık

        var newAccessToken = GenerateAccessToken(principal.Claims);
        var newRefreshToken = GenerateRefreshToken();

        return new ObjectResult(new
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }

    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false, 
            ValidateIssuer = false, 
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
            ValidateLifetime = false 
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
        var jwtSecurityToken = securityToken as JwtSecurityToken;
        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }

}



public class LoginModel
{
    public int compNo { get; set; }
    public int userNo { get; set; }
    public string userPass { get; set; }
}
public class TokenModel
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}

