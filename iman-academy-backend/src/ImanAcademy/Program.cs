using ImanAcademy;
using ImanAcademy.AuthModels;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration)
);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

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
    .AddRoles<IdentityRole<Guid>>()
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
            policy.WithOrigins("https://localhost:3002") // Your Next.js local URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                  .WithOrigins("https://localhost:3000") // Your Next.js local URL
                   .AllowAnyMethod()
                   .AllowAnyHeader()
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
    options.HeaderName = AuthConstants.CsrfTokenHeaderName;
    options.Cookie.Name = AuthConstants.CsrfTokenCookieName;
    options.Cookie.HttpOnly = false; // frontend JS needs to read it
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

builder.Services.AddAuthorization();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IEmailService, SmtpEmailSender>();
builder.Services.AddScoped<GoogleSignInService>();
builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();
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
app.MapControllers();

app.Run();

// Required so WebApplicationFactory<Program> in the test project can reference
// this entry point - top-level statements otherwise generate an internal one.
public partial class Program
{
}