using MimeKit;
using MailKit.Net.Smtp;

namespace ImanAcademy;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
}
public class SmtpEmailSender : IEmailService
{
    private readonly IConfiguration _config;

    public SmtpEmailSender(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
    {
        var smtpSection = _config.GetSection("Smtp");

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(smtpSection["FromAddress"]));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlMessage };

        using var client = new SmtpClient();
        await client.ConnectAsync(
            smtpSection["Host"],
            int.Parse(smtpSection["Port"]!),
            MailKit.Security.SecureSocketOptions.StartTls);

        var user = smtpSection["Username"];
        if (!string.IsNullOrEmpty(user))
            await client.AuthenticateAsync(user, smtpSection["Password"]);

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}