using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Services;
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupportController : ControllerBase
    {
        private readonly ISupportService _supportService;
        private readonly MistoGoContext _context;
        private const string TELEGRAM_BOT_TOKEN = "8240574480:AAGieRr74NWkLhCtXbRYNeLZFJQPodEDc_o";
        private const string TELEGRAM_CHAT_ID = "-4903979944";

        public SupportController(ISupportService supportService, MistoGoContext context)
        {
            _supportService = supportService;
            _context = context;
        }

        // 🧪 ТЕСТОВИЙ ENDPOINT ДЛЯ TELEGRAM
        [HttpGet("test-telegram")]
        public async Task<IActionResult> TestTelegram()
        {
            try
            {
                using var http = new HttpClient();
                var url = $"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage";
                
                var payload = new
                {
                    chat_id = TELEGRAM_CHAT_ID,
                    text = $"🧪 Test from API endpoint\nTime: {DateTime.Now:yyyy-MM-dd HH:mm:ss}",
                    parse_mode = "HTML"
                };
                
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await http.PostAsync(url, content);
                var result = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    return Ok(new { success = true, message = "Sent to Telegram!", telegramResponse = result });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Failed", telegramResponse = result });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // 🧪 ТЕСТОВИЙ ENDPOINT ДЛЯ EMAIL
        [HttpGet("test-email")]
        public async Task<IActionResult> TestEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { success = false, message = "Email parameter required" });
            }

            try
            {
                var emailNotifier = new EmailNotifier();
                await emailNotifier.SendTicketCreatedEmailAsync(
                    email,
                    "Test Subject",
                    "This is a test message from MistoGO API",
                    99999
                );

                return Ok(new { success = true, message = $"Test email sent to {email}" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // Метод для відправки в Telegram
        private async Task<bool> SendTelegramNotificationAsync(string message)
        {
            try
            {
                using var http = new HttpClient();
                var url = $"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage";
                
                var payload = new
                {
                    chat_id = TELEGRAM_CHAT_ID,
                    text = message,
                    parse_mode = "HTML"
                };
                
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await http.PostAsync(url, content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Telegram error: {ex.Message}");
                return false;
            }
        }

        // 🟢 СТВОРИТИ ТІКЕТ (авторизовані + гості)
        [HttpPost("tickets")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto request, [FromHeader(Name = "User-Id")] long? userId)
        {
            Console.WriteLine("====================================");
            Console.WriteLine($"📝 Creating ticket: {request.Subject}");
            Console.WriteLine($"📧 Email: {request.Email}");
            Console.WriteLine("====================================");

            try
            {
                // Валідація
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.Message))
                {
                    return BadRequest(new { success = false, message = "Email, тема та повідомлення обов'язкові" });
                }

                // Створення тікету
                var ticket = await _supportService.CreateTicketAsync(request, userId);
                Console.WriteLine($"✅ Ticket created: ID={ticket.Id}");

                // 📧 EMAIL NOTIFICATION
                try
                {
                    Console.WriteLine("📧 Sending email notification...");
                    var emailNotifier = new EmailNotifier();
                    await emailNotifier.SendTicketCreatedEmailAsync(
                        request.Email,
                        request.Subject,
                        request.Message,
                        ticket.Id
                    );
                    Console.WriteLine("✅ Email sent successfully");
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"❌ Email error: {emailEx.Message}");
                    // Не кидаємо exception - тікет вже створено
                }

                // 📱 TELEGRAM NOTIFICATION
                try
                {
                    Console.WriteLine("📱 Sending Telegram notification...");
                    var telegramMessage = $@"
<b>🆕 НОВА ЗАЯВКА У ПІДТРИМКУ</b>
━━━━━━━━━━━━━━
<b>📧 Email:</b> {request.Email}
<b>👤 Користувач:</b> {(userId.HasValue ? $"ID {userId}" : "Гість")}
<b>📝 Тема:</b> {request.Subject}

<b>💬 Повідомлення:</b>
{request.Message}
━━━━━━━━━━━━━━
<b>🆔 Ticket ID:</b> {ticket.Id}
<b>🕓 Час:</b> {DateTime.Now:dd.MM.yyyy HH:mm}
";
                    var telegramSent = await SendTelegramNotificationAsync(telegramMessage);
                    Console.WriteLine(telegramSent ? "✅ Telegram sent" : "❌ Telegram failed");
                }
                catch (Exception telegramEx)
                {
                    Console.WriteLine($"❌ Telegram error: {telegramEx.Message}");
                }

                Console.WriteLine("====================================");

                return Ok(new
                {
                    success = true,
                    message = "Тікет створено успішно!",
                    ticketId = ticket.Id,
                    ticket = new
                    {
                        id = ticket.Id,
                        subject = ticket.Subject,
                        status = ticket.Status,
                        priority = ticket.Priority,
                        category = ticket.Category,
                        createdAt = ticket.CreatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating ticket: {ex.Message}");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // 🔹 ОТРИМАТИ МОЇ ТІКЕТИ
        [HttpGet("tickets/my")]
        public async Task<IActionResult> GetMyTickets([FromHeader(Name = "User-Id")] long? userId)
        {
            if (!userId.HasValue)
                return Unauthorized(new { success = false, message = "Необхідна авторизація" });

            try
            {
                var tickets = await _supportService.GetUserTicketsAsync(userId.Value);

                return Ok(new
                {
                    success = true,
                    tickets = tickets.Select(t => new
                    {
                        id = t.Id,
                        subject = t.Subject,
                        status = t.Status,
                        priority = t.Priority,
                        category = t.Category,
                        createdAt = t.CreatedAt,
                        updatedAt = t.UpdatedAt
                    })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // 🔹 ОТРИМАТИ КОНКРЕТНИЙ ТІКЕТ З ПОВІДОМЛЕННЯМИ
        [HttpGet("tickets/{ticketId}")]
        public async Task<IActionResult> GetTicket(
            long ticketId,
            [FromHeader(Name = "User-Id")] long? userId,
            [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            try
            {
                var ticket = await _supportService.GetTicketByIdAsync(ticketId, userId, isAdmin);
                if (ticket == null)
                    return NotFound(new { success = false, message = "Тікет не знайдено" });

                var messages = await _context.SupportMessages
                    .Where(m => m.TicketId == ticketId)
                    .Include(m => m.User)
                    .OrderBy(m => m.CreatedAt)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    ticket = new
                    {
                        id = ticket.Id,
                        subject = ticket.Subject,
                        status = ticket.Status,
                        priority = ticket.Priority,
                        category = ticket.Category,
                        email = ticket.Email,
                        createdAt = ticket.CreatedAt,
                        updatedAt = ticket.UpdatedAt,
                        user = ticket.User != null ? new
                        {
                            id = ticket.User.Id,
                            fullName = ticket.User.FullName,
                            email = ticket.User.Email
                        } : null,
                        messages = messages.Select(m => new
                        {
                            id = m.Id,
                            message = m.Message,
                            isAdmin = m.IsAdmin,
                            authorName = m.IsAdmin ? "Підтримка MistoGO" :
                                        (m.User?.FullName ?? m.AuthorName ?? "Користувач"),
                            createdAt = m.CreatedAt
                        })
                    }
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // 🟠 ДОДАТИ ПОВІДОМЛЕННЯ ДО ТІКЕТУ
        [HttpPost("tickets/{ticketId}/messages")]
        public async Task<IActionResult> AddMessage(
            long ticketId,
            [FromBody] AddMessageDto request,
            [FromHeader(Name = "User-Id")] long? userId,
            [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Message))
                    return BadRequest(new { success = false, message = "Повідомлення не може бути порожнім" });

                var message = await _supportService.AddMessageAsync(ticketId, request, userId, isAdmin);

                // Отримуємо email тікету для відправки сповіщення
                var ticket = await _context.SupportTickets.FindAsync(ticketId);

                // 📧 EMAIL NOTIFICATION
                if (ticket != null && !string.IsNullOrEmpty(ticket.Email))
                {
                    try
                    {
                        var emailNotifier = new EmailNotifier();
                        await emailNotifier.SendNewMessageEmailAsync(
                            ticket.Email,
                            ticketId,
                            request.Message,
                            isAdmin
                        );
                    }
                    catch (Exception emailEx)
                    {
                        Console.WriteLine($"❌ Email error: {emailEx.Message}");
                    }
                }

                // 📱 TELEGRAM NOTIFICATION
                try
                {
                    var telegramMessage = $@"
<b>💬 НОВЕ ПОВІДОМЛЕННЯ В ТІКЕТІ #{ticketId}</b>
━━━━━━━━━━━━━━
<b>👤 Від:</b> {(isAdmin ? "Підтримка MistoGO" : "Користувач")}
<b>🕓 Час:</b> {DateTime.Now:dd.MM.yyyy HH:mm}

<b>📩 Повідомлення:</b>
{request.Message}
";
                    await SendTelegramNotificationAsync(telegramMessage);
                }
                catch (Exception telegramEx)
                {
                    Console.WriteLine($"❌ Telegram error: {telegramEx.Message}");
                }

                return Ok(new
                {
                    success = true,
                    message = "Повідомлення додано",
                    data = new
                    {
                        id = message.Id,
                        message = message.Message,
                        isAdmin = message.IsAdmin,
                        createdAt = message.CreatedAt
                    }
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // 🔹 ЗАКРИТИ ТІКЕТ
        [HttpPatch("tickets/{ticketId}/close")]
        public async Task<IActionResult> CloseTicket(
            long ticketId,
            [FromHeader(Name = "User-Id")] long? userId,
            [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            try
            {
                var success = await _supportService.UpdateTicketStatusAsync(ticketId, "closed", userId, isAdmin);
                if (!success)
                    return NotFound(new { success = false, message = "Тікет не знайдено" });

                return Ok(new { success = true, message = "Тікет закрито" });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // 🔹 ОНОВИТИ СТАТУС (для адміна)
        [HttpPatch("tickets/{ticketId}/status")]
        public async Task<IActionResult> UpdateStatus(
            long ticketId,
            [FromBody] UpdateStatusDto request,
            [FromHeader(Name = "User-Id")] long? userId,
            [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            if (!isAdmin)
                return Forbid();

            try
            {
                var success = await _supportService.UpdateTicketStatusAsync(ticketId, request.Status, userId, isAdmin);
                if (!success)
                    return NotFound(new { success = false, message = "Тікет не знайдено" });

                return Ok(new { success = true, message = "Статус оновлено" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // 🔹 ОНОВИТИ ПРІОРИТЕТ (для адміна)
        [HttpPatch("tickets/{ticketId}/priority")]
        public async Task<IActionResult> UpdatePriority(
            long ticketId,
            [FromBody] UpdatePriorityDto request,
            [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            if (!isAdmin)
                return Forbid();

            try
            {
                var success = await _supportService.UpdateTicketPriorityAsync(ticketId, request.Priority);
                if (!success)
                    return NotFound(new { success = false, message = "Тікет не знайдено" });

                return Ok(new { success = true, message = "Пріоритет оновлено" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // 🔹 ОТРИМАТИ ВСІ ТІКЕТИ (для адміна)
        [HttpGet("admin/tickets")]
        public async Task<IActionResult> GetAllTickets(
            [FromQuery] string? status,
            [FromQuery] string? priority,
            [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            if (!isAdmin)
                return Forbid();

            try
            {
                var tickets = await _supportService.GetAllTicketsAsync(status, priority);

                return Ok(new
                {
                    success = true,
                    tickets = tickets.Select(t => new
                    {
                        id = t.Id,
                        subject = t.Subject,
                        status = t.Status,
                        priority = t.Priority,
                        category = t.Category,
                        email = t.Email,
                        createdAt = t.CreatedAt,
                        updatedAt = t.UpdatedAt,
                        user = t.User != null ? new
                        {
                            id = t.User.Id,
                            fullName = t.User.FullName,
                            email = t.User.Email
                        } : null
                    })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }

    // ======= DTOs =======
    public class UpdateStatusDto
    {
        public string Status { get; set; } = "";
    }

    public class UpdatePriorityDto
    {
        public string Priority { get; set; } = "";
    }
}