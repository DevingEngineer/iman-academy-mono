using ImanAcademy.AuthModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers;

[ApiController]
[Route("api/auth/frontend")]
public class AuthControllerFrontend : ControllerBase
{
    public AuthControllerFrontend()
    {
    }

    [HttpPost("register")]
    [ProducesResponseType(201)]
    public async Task<IActionResult> RegisterUserAsync(RegisterRequest request)
    {
        return Ok();
    }
    [HttpPost("login")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> LoginAndSetCookiesUserAsync(LoginRequest request)
    {
        return Ok();
    }
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAndClearCookiesUserAsync()
    {
        return Ok();
    }
    [Authorize]
    [HttpPost("refresh-token")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> RefreshTokenAsync()
    {
        return Ok();
    }
    [HttpPost("google-id-token")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> GoogleAuthorizationByIdTokenFlowAsync() { 
        return Ok();
    }
    [HttpPost("google-code")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> GoogleAuthorizationByCodeFlowAsync()
    {
        return Ok();
    }
    [HttpPost("reset-password")]
    [ProducesResponseType(201)]
    public async Task<IActionResult> ResetPassword(string code) {
        return Ok();
    }

    [Authorize]
    [HttpPost("change-password")]
    [ProducesResponseType(201)]
    public async Task<IActionResult> ChangePasswordAsync()
    {
        return Ok();
    }

    [Authorize]
    [HttpGet("current-user")]
    public async Task<IActionResult> GetCurrentUserAsync()
    {
        return Ok();
    }

}