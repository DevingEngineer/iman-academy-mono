using ImanAcademy.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenService _tokenService;

        public AuthController(UserManager<ApplicationUser> userManager, IJwtTokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public record RegisterRequest(string Email, string Password);
        public record LoginRequest(string Email, string Password);
        public record RefreshRequest(string RefreshToken);
        public record TokenResponse(string AccessToken, string RefreshToken);

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var user = new ApplicationUser { UserName = request.Email, Email = request.Email };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized("Invalid email or password.");

            var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var refreshToken = await _tokenService.GenerateAndStoreRefreshTokenAsync(user);

            return Ok(new TokenResponse(accessToken, refreshToken));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshRequest request)
        {
            var existing = await _tokenService.ValidateRefreshTokenAsync(request.RefreshToken);
            if (existing is null)
                return Unauthorized("Invalid or expired refresh token.");

            var newAccessToken = await _tokenService.GenerateAccessTokenAsync(existing.User);
            var newRefreshToken = await _tokenService.GenerateAndStoreRefreshTokenAsync(existing.User);

            // Rotate: revoke the old one, link it to the new one for audit purposes
            await _tokenService.RevokeRefreshTokenAsync(existing, newRefreshToken);

            return Ok(new TokenResponse(newAccessToken, newRefreshToken));
        }

        [HttpPost("revoke")]
        public async Task<IActionResult> Revoke(RefreshRequest request)
        {
            var existing = await _tokenService.ValidateRefreshTokenAsync(request.RefreshToken);
            if (existing is null)
                return NotFound();

            await _tokenService.RevokeRefreshTokenAsync(existing);
            return NoContent();
        }
    }
}
