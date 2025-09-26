using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("trips")]
    public class Trip
    {
        [Key] [Column("id")] public long Id { get; set; }

        [Column("user_id")]    public long UserId { get; set; }
        [Column("vehicle_id")] public long VehicleId { get; set; }

        [MaxLength(20)] [Column("status")] public string Status { get; set; } = "reserved";

        [Column("reserved_at")] public DateTime? ReservedAt { get; set; }
        [Column("started_at")]  public DateTime? StartedAt { get; set; }
        [Column("ended_at")]    public DateTime? EndedAt { get; set; }

        [Column("minutes_total")] public int MinutesTotal { get; set; } = 0;
        [Column("km_total", TypeName = "decimal(8,2)")] public decimal KmTotal { get; set; } = 0m;

        [Column("unlock_fee", TypeName = "decimal(10,2)")] public decimal? UnlockFee { get; set; }
        [Column("per_minute", TypeName = "decimal(10,2)")] public decimal? PerMinute { get; set; }
        [Column("per_km",     TypeName = "decimal(10,2)")] public decimal? PerKm { get; set; }
        [Column("cost_total", TypeName = "decimal(10,2)")] public decimal? CostTotal { get; set; }

        [Column("rating")] public byte? Rating { get; set; } // 1..5, nullable
        [Column("comment", TypeName = "text")] public string? Comment { get; set; }

        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public Vehicle? Vehicle { get; set; }
    }
}
