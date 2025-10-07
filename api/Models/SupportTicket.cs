using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("support_tickets")]
    public class SupportTicket
    {
        [Key] [Column("id")] public long Id { get; set; }

        [Column("user_id")] public long? UserId { get; set; }

        [MaxLength(120)] [Column("email")] public string? Email { get; set; }
        [MaxLength(200)] [Column("subject")] public string? Subject { get; set; }
        [Column("message", TypeName = "text")] public string? Message { get; set; }

        [MaxLength(30)]  [Column("category")] public string? Category { get; set; }
        [MaxLength(10)]  [Column("priority")] public string Priority { get; set; } = "normal";
        [MaxLength(20)]  [Column("status")]   public string Status   { get; set; } = "open";

        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Column("updated_at")] public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
    }
}
