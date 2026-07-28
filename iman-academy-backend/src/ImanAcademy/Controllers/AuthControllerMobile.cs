using ImanAcademy.AuthModels;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ImanAcademy.Controllers;

[ApiController]
[Route("api/auth/mobile")]
public class AuthControllerMobile : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly GoogleSignInService _googleSignIn;
    private readonly IJwtTokenService _tokenService;
    private readonly IConfiguration _config;
    public AuthControllerMobile(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, GoogleSignInService googleSignIn, IJwtTokenService tokenService, IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _googleSignIn = googleSignIn;
        _tokenService = tokenService;
        _config = config;
    }
    [HttpPost("register")]
    [ProducesResponseType(201)]
    public async Task<IActionResult> RegisterUserAsync(RegisterRequest request)
    {
        var user = new ApplicationUser { UserName = request.Email, Email = request.Email };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok();
    }

    [HttpPost("login")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> LoginUserAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized("Invalid email or password.");

        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        var refreshToken = await _tokenService.GenerateAndStoreRefreshTokenAsync(user);

        return Ok(await IssueTokensAsync(user));
    }
    [HttpPost("refresh-token")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> RefreshTokenAsync(RefreshRequest request)
    {
        if (!Request.Cookies.TryGetValue("refreshToken", out var rawToken) || string.IsNullOrEmpty(rawToken))
            return Unauthorized("No refresh token.");

        var existing = await _tokenService.ValidateRefreshTokenAsync(rawToken);
        if (existing is null)
        {
            Response.Cookies.Delete("refreshToken");
            return Unauthorized("Invalid or expired refresh token.");
        }

        var newAccessToken = await _tokenService.GenerateAccessTokenAsync(existing.User);
        var newRefreshToken = await _tokenService.GenerateAndStoreRefreshTokenAsync(existing.User);

        // Rotate: revoke the old one, link it to the new one for audit purposes
        await _tokenService.RevokeRefreshTokenAsync(existing, newRefreshToken);

        return Ok(new TokenResponse()
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }
    [HttpPost("revoke-refresh-token")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> RevokeRefreshTokenAsync(RefreshRequest request)
    {
        var existing = await _tokenService.ValidateRefreshTokenAsync(request.RefreshToken);
        if (existing is null)
            return NotFound();

        await _tokenService.RevokeRefreshTokenAsync(existing);
        return NoContent();
    }
    [HttpPost("google-id-token")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> GoogleAuthorizationByIdTokenFlowAsync()
    {
        return NoContent();
    }
    [HttpPost("google-code")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> GoogleAuthorizationByCodeFlowAsync()
    {
        return NoContent();
    }
    [HttpPost("change-password")]
    [ProducesResponseType(201)]
    public async Task<IActionResult> ChangePasswordAsync()
    {
        return NoContent();
    }
    [HttpPost("current-user")]
    public async Task<IActionResult> CurrentUserAsync()
    {
        return NoContent();
    }
    private async Task<IActionResult> IssueTokensAsync(ApplicationUser user)
    {
        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        var refreshToken = await _tokenService.GenerateAndStoreRefreshTokenAsync(user);

        SetRefreshCookie(refreshToken);
        return Ok(new TokenResponse() { AccessToken = accessToken }); // only the access token is visible to JS
    }

    private void SetRefreshCookie(string rawRefreshToken)
    {


        Response.Cookies.Append(
            "refreshToken",
            rawRefreshToken,
            new CookieOptions()
            {
                HttpOnly = true,
                Secure = false, // allow plain http on localhost, force https elsewhere
                SameSite = SameSiteMode.Strict, // refresh token never needs to go cross-site
                Path = "/api/auth/refresh", // only sent to auth endpoints, not every request
                Expires = DateTime.Now.AddDays(15)
            });
    }
}
