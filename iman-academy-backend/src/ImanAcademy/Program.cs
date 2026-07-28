using ImanAcademy;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration)
);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<ValidateAntiforgeryTokenFilter>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<ImanAcademyContext>(options =>
    options.UseNpgsql(connectionString));
// Identity (no cookie/UI — just user/role management)
builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ImanAcademyContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

// JWT auth
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"]!;
var jwtIssuer = jwtSection["Issuer"]!;
var jwtAudience = jwtSection["Audience"]!;

const string CookieScheme = "Identity.Application";
const string JwtScheme = JwtBearerDefaults.AuthenticationScheme;
const string SmartScheme = "Smart"; // the one we set as default
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "frontendCorsPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:3002") // Your Next.js local URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Required if you pass cookies or HttpOnly tokens
        });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = SmartScheme;
    options.DefaultChallengeScheme = SmartScheme;
    options.DefaultSignInScheme = CookieScheme;
})
.AddPolicyScheme(SmartScheme, "JWT or Cookie", options =>
{
    options.ForwardDefaultSelector = context =>
    {
        var authHeader = context.Request.Headers.Authorization.ToString();
        return authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
            ? JwtScheme
            : CookieScheme;
    };
})
.AddCookie(CookieScheme, options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict; // Lax same-origin, None cross-origin
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;
    options.Events.OnRedirectToLogin = ctx =>
    {
        ctx.Response.StatusCode = 401; // API, not a browser page — no HTML redirect
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = ctx =>
    {
        ctx.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
})
.AddJwtBearer(JwtScheme, options =>
{
    var jwt = builder.Configuration.GetSection("Jwt");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwt["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwt["Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromSeconds(30)
    };
})
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
    options.CallbackPath = "/api/auth/google/callback";
    options.SignInScheme = CookieScheme; // redirect flow always signs into the cookie
});
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false; // frontend JS needs to read it
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    //options.Cookie.SameSite = SameSiteMode.None;
});
builder.Services.AddAuthorization();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<GoogleSignInService>();
builder.Services.AddAuthorization();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (true || app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => { options.SwaggerEndpoint("/openapi/v1.json", "ImanAcademy v1"); });
}

app.UseHttpsRedirection();
app.UseCors("frontendCorsPolicy");
app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/auth/csrf", (IAntiforgery antiforgery, HttpContext context) =>
{
    var tokens = antiforgery.GetAndStoreTokens(context);

    //// Append the token to a SameSite cookie that Next.js can read
    //context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, new CookieOptions
    //{
    //    HttpOnly = false, // Must be false so Next.js client-side JS can read it
    //    Secure = true,
    //    SameSite = SameSiteMode.Lax
    //});

    return Results.Ok(new { token = tokens.RequestToken });
});

app.MapControllers();

app.Run();
