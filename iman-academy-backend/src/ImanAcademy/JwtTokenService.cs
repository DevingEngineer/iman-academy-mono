using ImanAcademy.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ImanAcademy
{

    public interface IJwtTokenService
    {
        Task<string> GenerateAccessTokenAsync(ApplicationUser user);
        Task<(string, DateTime)> GenerateAndStoreRefreshTokenAsync(ApplicationUser user);
        Task<RefreshToken?> ValidateRefreshTokenAsync(string rawToken);
        Task RevokeRefreshTokenAsync(RefreshToken token, string? replacedByRawToken = null);
    }

    public class JwtTokenService : IJwtTokenService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly ImanAcademyContext _db;

        public JwtTokenService(UserManager<ApplicationUser> userManager, IConfiguration config, ImanAcademyContext db)
        {
            _userManager = userManager;
            _config = config;
            _db = db;
        }

        public async Task<string> GenerateAccessTokenAsync(ApplicationUser user)
        {
            var jwtSection = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id),
        };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSection["AccessTokenMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<(string, DateTime)> GenerateAndStoreRefreshTokenAsync(ApplicationUser user)
        {
            var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var days = double.Parse(_config["Jwt:RefreshTokenDays"]!);

            var entity = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = Hash(rawToken),
                ExpiresAt = DateTime.UtcNow.AddDays(days)
            };

            _db.RefreshTokens.Add(entity);
            await _db.SaveChangesAsync();

            return (rawToken, entity.ExpiresAt); // only the raw value is ever returned to the client
        }

        public async Task<RefreshToken?> ValidateRefreshTokenAsync(string rawToken)
        {
            var hash = Hash(rawToken);
            var entity = await _db.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.TokenHash == hash);

            return entity is { IsActive: true } ? entity : null;
        }

        public async Task RevokeRefreshTokenAsync(RefreshToken token, string? replacedByRawToken = null)
        {
            token.RevokedAt = DateTime.UtcNow;
            if (replacedByRawToken is not null)
                token.ReplacedByTokenHash = Hash(replacedByRawToken);

            await _db.SaveChangesAsync();
        }

        private static string Hash(string input)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(bytes);
        }
    }
}
