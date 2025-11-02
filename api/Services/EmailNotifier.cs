using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MistoGO.Services
{
    public class EmailNotifier
    {
        private readonly string _smtpServer;
        private readonly int _port;
        private readonly string _senderEmail;
        private readonly string _senderName;
        private readonly string _username;
        private readonly string _password;

        public EmailNotifier()
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            _smtpServer = config["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
            _port = int.Parse(config["EmailSettings:Port"] ?? "587");
            _senderEmail = config["EmailSettings:SenderEmail"] ?? "";
            _senderName = config["EmailSettings:SenderName"] ?? "MistoGO Support";
            _username = config["EmailSettings:Username"] ?? "";
            _password = config["EmailSettings:Password"] ?? "";
        }

        public async Task SendTicketCreatedEmailAsync(string toEmail, string subject, string message, long ticketId)
        {
            string body = $@"
<b>🆕 Новий тікет створено!</b><br>
━━━━━━━━━━━━━━<br>
<b>📧 Email:</b> {toEmail}<br>
<b>📝 Тема:</b> {subject}<br>
<b>💬 Повідомлення:</b><br>{message}<br><br>
<b>🆔 Номер тікета:</b> {ticketId}<br>
━━━━━━━━━━━━━━<br>
<i>З повагою, команда MistoGO</i>";

            await SendEmailAsync(toEmail, subject, body, isHtml: true);
        }

        public async Task SendNewMessageEmailAsync(string toEmail, long ticketId, string message, bool isAdmin)
        {
            string author = isAdmin ? "Підтримка MistoGO" : "Користувач";
            string body = $@"
<b>💬 Нове повідомлення в тікеті #{ticketId}</b><br>
━━━━━━━━━━━━━━<br>
<b>👤 Від:</b> {author}<br><br>
{message}<br><br>
━━━━━━━━━━━━━━<br>
<i>Переглянути у вашому акаунті MistoGO</i>";

            await SendEmailAsync(toEmail, $"Нове повідомлення у тікеті #{ticketId}", body, isHtml: true);
        }

        private async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
        {
            try
            {
                using var client = new SmtpClient(_smtpServer, _port)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(_username, _password)
                };

                var mail = new MailMessage
                {
                    From = new MailAddress(_senderEmail, _senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };

                mail.To.Add(to);

                await client.SendMailAsync(mail);
                Console.WriteLine($"✅ Email sent to {to}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending email: {ex.Message}");
                throw;
            }
        }
    }
}
