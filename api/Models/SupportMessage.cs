using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("support_messages")]
    public class SupportMessage
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("ticket_id")]
        public long TicketId { get; set; }

        [Column("user_id")]
        public long? UserId { get; set; }

        [Column("message", TypeName = "text")]
        public string Message { get; set; } = "";

        [Column("is_admin")]
        public bool IsAdmin { get; set; } = false;

        [MaxLength(100)]
        [Column("author_name")]
        public string? AuthorName { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public SupportTicket? Ticket { get; set; }
        public User? User { get; set; }
    }
}