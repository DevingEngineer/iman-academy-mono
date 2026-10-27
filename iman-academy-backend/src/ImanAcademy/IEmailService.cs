using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;

namespace ImanAcademy;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
}
public class SmtpEmailSender : IEmailService
{
    private readonly EmailOptions _emailOptions;

    public SmtpEmailSender(IOptions<EmailOptions> emailOptions)
    {
        _emailOptions = emailOptions.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
    {

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(_emailOptions.FromAddress));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlMessage };

        using var client = new SmtpClient();
        await client.ConnectAsync(
            _emailOptions.Host,
            _emailOptions.Port,
            MailKit.Security.SecureSocketOptions.StartTls);

        var user = _emailOptions.Username;
        if (!string.IsNullOrEmpty(user))
            await client.AuthenticateAsync(user, _emailOptions.Password);

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}