using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using BackOffice.Data;
using BackOffice.Models;
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

        var claims = new List<Claim>
        {
            new Claim("CompNo", user.CompNo.ToString()),
            new Claim("UserNo", user.UserNo.ToString()),
            new Claim("UserPass", user.UserPass),
            new Claim("Departmant", user.Departmant.ToString()),
            new Claim("CreateDate", user.CreateDate.ToString()),
            new Claim("ModifyDate", user.ModifyDate.ToString()),
            new Claim("IsActive", Convert.ToBase64String(user.IsActive)),
            new Claim("name", user.name),
            new Claim("surname", user.surname)
        };

        var accessToken = GenerateAccessToken(claims);
        var refreshToken = GenerateRefreshToken();

        return Ok(new
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        });
    }

    private string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expires = DateTime.Now.AddSeconds(20);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
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
        if (tokenModel == null || string.IsNullOrEmpty(tokenModel.AccessToken) || string.IsNullOrEmpty(tokenModel.RefreshToken))
        {
            return BadRequest(new { message = "Invalid token model" });
        }

        var principal = GetPrincipalFromExpiredToken(tokenModel.AccessToken);
        if (principal == null)
        {
            return BadRequest(new { message = "Invalid access token" });
        }

        var expirationClaim = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Exp);
        if (expirationClaim != null && long.TryParse(expirationClaim.Value, out long exp))
        {
            var expirationDate = DateTimeOffset.FromUnixTimeSeconds(exp).UtcDateTime;
            if (expirationDate < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Security Token Expired" });
            }
        }

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
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateLifetime = false // Süresi dolmuş tokenları doğrulamak için bu ayarı false yapıyoruz
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }
            return principal;
        }
        catch
        {
            throw new SecurityTokenException("Invalid token");
        }
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
