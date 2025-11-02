using MistoGO.Models;

namespace MistoGO.Services
{
    public interface ISupportService
    {
        Task<SupportTicket> CreateTicketAsync(CreateTicketDto request, long? userId);
        Task<SupportMessage> AddMessageAsync(long ticketId, AddMessageDto request, long? userId, bool isAdmin);
        Task<List<SupportTicket>> GetUserTicketsAsync(long userId);
        Task<SupportTicket?> GetTicketByIdAsync(long ticketId, long? userId, bool isAdmin);
        Task<bool> UpdateTicketStatusAsync(long ticketId, string status, long? userId, bool isAdmin);
        Task<bool> UpdateTicketPriorityAsync(long ticketId, string priority);
        Task<List<SupportTicket>> GetAllTicketsAsync(string? status, string? priority);
    }
}
