using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;
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
    [Route("api/support_tickets")]
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

        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            try
            {
                var tickets = await _context.SupportTickets
                    .Include(t => t.User)
                    .OrderByDescending(t => t.CreatedAt)
                    .ToListAsync();
                return Ok(tickets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("test-telegram")]
        public async Task<IActionResult> TestTelegram()
        {
            try
            {
                using var http = new HttpClient();
                var url = $"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage";
                var payload = new { chat_id = TELEGRAM_CHAT_ID, text = $"Test {DateTime.Now}", parse_mode = "HTML" };
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await http.PostAsync(url, content);
                return response.IsSuccessStatusCode ? Ok(new { success = true, message = "Sent!" }) : BadRequest(new { success = false });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("test-email")]
        public async Task<IActionResult> TestEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest(new { message = "Email required" });

            try
            {
                var emailNotifier = new EmailNotifier();
                await emailNotifier.SendTicketCreatedEmailAsync(email, "Test", "Test message", 99999);
                return Ok(new { success = true, message = $"Sent to {email}" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private async Task<bool> SendTelegramNotificationAsync(string message)
        {
            try
            {
                using var http = new HttpClient();
                var url = $"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage";
                var payload = new { chat_id = TELEGRAM_CHAT_ID, text = message, parse_mode = "HTML" };
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await http.PostAsync(url, content);
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        [HttpPost("tickets")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto dto, [FromHeader(Name = "User-Id")] long? userId)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Subject) || string.IsNullOrEmpty(dto.Message))
                    return BadRequest(new { message = "Email, subject, message required" });

                var ticket = new SupportTicket
                {
                    Email = dto.Email,
                    Subject = dto.Subject,
                    Category = dto.Category ?? "general",
                    Status = "open",
                    Priority = "medium",
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.SupportTickets.Add(ticket);
                await _context.SaveChangesAsync();

                var message = new SupportMessage
                {
                    TicketId = ticket.Id,
                    Message = dto.Message,
                    IsAdmin = false,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.SupportMessages.Add(message);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, ticketId = ticket.Id, ticket });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("tickets/my")]
        public async Task<IActionResult> GetMyTickets([FromHeader(Name = "User-Id")] long? userId)
        {
            if (!userId.HasValue)
                return Unauthorized();

            try
            {
                var tickets = await _context.SupportTickets
                    .Where(t => t.UserId == userId.Value)
                    .OrderByDescending(t => t.CreatedAt)
                    .ToListAsync();

                return Ok(new { success = true, tickets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("tickets/{ticketId}")]
        public async Task<IActionResult> GetTicket(long ticketId, [FromHeader(Name = "User-Id")] long? userId, [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            try
            {
                var ticket = await _context.SupportTickets
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == ticketId);

                if (ticket == null)
                    return NotFound();

                if (!isAdmin && ticket.UserId != userId)
                    return Forbid();

                var messages = await _context.SupportMessages
                    .Where(m => m.TicketId == ticketId)
                    .Include(m => m.User)
                    .OrderBy(m => m.CreatedAt)
                    .ToListAsync();

                return Ok(new { success = true, ticket, messages });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("tickets/{ticketId}/messages")]
        public async Task<IActionResult> AddMessage(long ticketId, [FromBody] AddMessageDto dto, [FromHeader(Name = "User-Id")] long? userId, [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.Message))
                    return BadRequest(new { message = "Message required" });

                var ticket = await _context.SupportTickets.FindAsync(ticketId);
                if (ticket == null)
                    return NotFound();

                if (!isAdmin && ticket.UserId != userId)
                    return Forbid();

                var message = new SupportMessage
                {
                    TicketId = ticketId,
                    Message = dto.Message,
                    IsAdmin = isAdmin,
                    UserId = isAdmin ? null : userId,
                    AuthorName = dto.AuthorName,
                    CreatedAt = DateTime.UtcNow
                };

                _context.SupportMessages.Add(message);
                ticket.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("tickets/{ticketId}/close")]
        public async Task<IActionResult> CloseTicket(long ticketId, [FromHeader(Name = "User-Id")] long? userId, [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            try
            {
                var ticket = await _context.SupportTickets.FindAsync(ticketId);
                if (ticket == null)
                    return NotFound();

                if (!isAdmin && ticket.UserId != userId)
                    return Forbid();

                ticket.Status = "closed";
                ticket.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("tickets/{ticketId}/status")]
        public async Task<IActionResult> UpdateStatus(long ticketId, [FromBody] UpdateStatusDto dto, [FromHeader(Name = "User-Id")] long? userId, [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            if (!isAdmin)
                return Forbid();

            try
            {
                var ticket = await _context.SupportTickets.FindAsync(ticketId);
                if (ticket == null)
                    return NotFound();

                ticket.Status = dto.Status;
                ticket.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("tickets/{ticketId}/priority")]
        public async Task<IActionResult> UpdatePriority(long ticketId, [FromBody] UpdatePriorityDto dto, [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            if (!isAdmin)
                return Forbid();

            try
            {
                var ticket = await _context.SupportTickets.FindAsync(ticketId);
                if (ticket == null)
                    return NotFound();

                ticket.Priority = dto.Priority;
                ticket.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("admin/tickets")]
        public async Task<IActionResult> GetAllTickets([FromQuery] string? status, [FromQuery] string? priority, [FromHeader(Name = "Is-Admin")] bool isAdmin = false)
        {
            if (!isAdmin)
                return Forbid();

            try
            {
                var query = _context.SupportTickets.Include(t => t.User).AsQueryable();

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(t => t.Status == status);

                if (!string.IsNullOrEmpty(priority))
                    query = query.Where(t => t.Priority == priority);

                var tickets = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();

                return Ok(new { success = true, tickets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class CreateTicketDto
    {
        public string Email { get; set; } = "";
        public string Subject { get; set; } = "";
        public string Message { get; set; } = "";
        public string? Category { get; set; }
    }

    public class AddMessageDto
    {
        public string Message { get; set; } = "";
        public string? AuthorName { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = "";
    }

    public class UpdatePriorityDto
    {
        public string Priority { get; set; } = "";
    }
}