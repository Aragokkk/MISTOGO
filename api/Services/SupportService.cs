using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Services
{
    public class SupportService : ISupportService
    {
        private readonly MistoGoContext _context;

        public SupportService(MistoGoContext context)
        {
            _context = context;
        }

        public async Task<SupportTicket> CreateTicketAsync(CreateTicketDto request, long? userId)
        {
            var ticket = new SupportTicket
            {
                UserId = userId,
                Email = request.Email,
                Subject = request.Subject,
                Status = "pending",
                Priority = "normal",
                Category = "general",
                CreatedAt = DateTime.UtcNow
            };

            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();

            var message = new SupportMessage
            {
                TicketId = ticket.Id,
                UserId = userId,
                Message = request.Message,
                IsAdmin = false,
                AuthorName = request.Email,
                CreatedAt = DateTime.UtcNow
            };

            _context.SupportMessages.Add(message);
            await _context.SaveChangesAsync();

            return ticket;
        }

        public async Task<SupportMessage> AddMessageAsync(long ticketId, AddMessageDto request, long? userId, bool isAdmin)
        {
            var ticket = await _context.SupportTickets.FindAsync(ticketId);
            if (ticket == null)
                throw new Exception("Тікет не знайдено");

            if (!isAdmin && userId != ticket.UserId)
                throw new UnauthorizedAccessException();

            var message = new SupportMessage
            {
                TicketId = ticketId,
                UserId = userId,
                Message = request.Message,
                IsAdmin = isAdmin,
                AuthorName = isAdmin ? "Підтримка MistoGO" : request.AuthorName,
                CreatedAt = DateTime.UtcNow
            };

            _context.SupportMessages.Add(message);
            await _context.SaveChangesAsync();

            ticket.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return message;
        }

        public async Task<List<SupportTicket>> GetUserTicketsAsync(long userId)
        {
            return await _context.SupportTickets
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<SupportTicket?> GetTicketByIdAsync(long ticketId, long? userId, bool isAdmin)
        {
            var ticket = await _context.SupportTickets
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null)
                return null;

            if (!isAdmin && ticket.UserId != userId)
                throw new UnauthorizedAccessException();

            return ticket;
        }

        public async Task<bool> UpdateTicketStatusAsync(long ticketId, string status, long? userId, bool isAdmin)
        {
            var ticket = await _context.SupportTickets.FindAsync(ticketId);
            if (ticket == null)
                return false;

            if (!isAdmin && ticket.UserId != userId)
                throw new UnauthorizedAccessException();

            ticket.Status = status;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTicketPriorityAsync(long ticketId, string priority)
        {
            var ticket = await _context.SupportTickets.FindAsync(ticketId);
            if (ticket == null)
                return false;

            ticket.Priority = priority;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<SupportTicket>> GetAllTicketsAsync(string? status, string? priority)
        {
            var query = _context.SupportTickets.Include(t => t.User).AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(t => t.Status == status);

            if (!string.IsNullOrEmpty(priority))
                query = query.Where(t => t.Priority == priority);

            return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        }
    }

    // ===== DTOs =====
    public class CreateTicketDto
    {
        public string Email { get; set; } = "";
        public string Subject { get; set; } = "";
        public string Message { get; set; } = "";
    }

    public class AddMessageDto
    {
        public string Message { get; set; } = "";
        public string? AuthorName { get; set; }
    }
}
