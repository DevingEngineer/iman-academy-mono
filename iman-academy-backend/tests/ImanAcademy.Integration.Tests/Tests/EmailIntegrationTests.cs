using Amazon.S3;
using Amazon.S3.Model;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MimeKit;
using Supabase;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImanAcademy.Integration.Tests.Tests;

/// <summary>
/// Loads real configuration (appsettings.Test.json + user secrets + env vars) once per test class.
/// No services, no DI container — tests call MailKit / Supabase directly.
/// </summary>
public class ConfigFixture
{
    public IConfiguration Configuration { get; }

    public ConfigFixture()
    {
        Configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appSettings.Test.json", optional: true, reloadOnChange: false)
            .AddUserSecrets<ConfigFixture>(optional: true)
            .AddEnvironmentVariables()
            .Build();
    }
}

[Trait("Category", "Integration")]
public class EmailIntegrationTests : IClassFixture<ConfigFixture>
{
    private readonly EmailOptions _email;

    public EmailIntegrationTests(ConfigFixture fixture)
    {
        _email = fixture.Configuration.GetSection("Email").Get<EmailOptions>()
                 ?? throw new InvalidOperationException("Email section missing from configuration.");
    }

    [Fact]
    public async Task SendEmail_ViaSmtp_DoesNotThrow()
    {
        var recipient = "bekturshukurov00@gmail.com";
        // Arrange
        Assert.False(string.IsNullOrWhiteSpace(recipient),
            "Set Email:TestRecipient in appsettings.Test.json or user secrets.");

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(_email.FromAddress));
        message.To.Add(MailboxAddress.Parse(recipient));
        message.Subject = $"Integration test - {DateTime.UtcNow:O}";
        message.Body = new TextPart("plain") { Text = "Direct SMTP integration test. Safe to ignore." };

        // Act
        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_email.Host, _email.Port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_email.Username, _email.Password);
        await smtp.SendAsync(message);
        await smtp.DisconnectAsync(true);

        // Assert — if we got here without an exception, the send succeeded
        Assert.True(smtp.IsConnected == false); // disconnected cleanly
    }
}


[Trait("Category", "Integration")]
public class SmtpEmailSenderIntegrationTests : IClassFixture<ConfigFixture>
{
    private readonly IEmailService _emailService;
    private readonly IConfiguration _config;

    public SmtpEmailSenderIntegrationTests(ConfigFixture fixture)
    {
        _config = fixture.Configuration;

        var emailOptions = _config.GetSection("Email").Get<EmailOptions>()
                           ?? throw new InvalidOperationException("Email section missing from configuration.");

        _emailService = new SmtpEmailSender(Options.Create(emailOptions));
    }

    [Fact]
    public async Task SendEmailAsync_WithValidMessage_SendsWithoutThrowing()
    {
        // Arrange
        var recipient = _config["Email:TestRecipient"];
        Assert.False(string.IsNullOrWhiteSpace(recipient),
            "Set Email:TestRecipient in appsettings.Test.json or user secrets before running this test.");

        var subject = $"Integration test - {DateTime.UtcNow:O}";
        var htmlMessage = "<p>Automated integration test email from SmtpEmailSender. Safe to ignore.</p>";

        // Act
        var exception = await Record.ExceptionAsync(() =>
            _emailService.SendEmailAsync(recipient!, subject, htmlMessage));

        // Assert
        Assert.Null(exception);
    }

    [Fact]
    public async Task SendEmailAsync_WithMissingHost_ThrowsRatherThanHangingOrSilentlyFailing()
    {
        // Arrange — bad host so the connect step fails fast and loud
        var badOptions = Options.Create(new EmailOptions
        {
            Host = "smtp.invalid.nonexistent-domain.test",
            Port = 587,
            FromAddress = "noreply@example.com"
        });

        var sender = new SmtpEmailSender(badOptions);

        // Act & Assert
        await Assert.ThrowsAnyAsync<Exception>(() =>
            sender.SendEmailAsync("someone@example.com", "test", "<p>test</p>"));
    }
}
