using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("payments")]
    public class Payment
    {
        [Key] [Column("id")] public long Id { get; set; }

        [Column("user_id")] public long UserId { get; set; }
        [Column("trip_id")] public long? TripId { get; set; }

        [Column("amount", TypeName = "decimal(10,2)")] public decimal Amount { get; set; }
        [MaxLength(3)] [Column("currency")] public string Currency { get; set; } = "UAH";

        [MaxLength(20)] [Column("status")] public string Status { get; set; } = "pending";

        [Column("created_at")]  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Column("processed_at")] public DateTime? ProcessedAt { get; set; }

        public User? User { get; set; }
        public Trip? Trip { get; set; }
    }
}
