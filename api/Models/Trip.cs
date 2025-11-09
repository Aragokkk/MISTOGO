using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("trips")]
    public class Trip
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("vehicle_id")]
        public long VehicleId { get; set; }

        [Column("user_id")]
        public long? UserId { get; set; }

        [Column("start_time")]
        public DateTime StartTime { get; set; } = DateTime.UtcNow;

        [Column("end_time")]
        public DateTime? EndTime { get; set; }

        [Column("start_lat", TypeName = "decimal(9,6)")]
        public decimal? StartLat { get; set; }

        [Column("start_lng", TypeName = "decimal(9,6)")]
        public decimal? StartLng { get; set; }

        [Column("end_lat", TypeName = "decimal(9,6)")]
        public decimal? EndLat { get; set; }

        [Column("end_lng", TypeName = "decimal(9,6)")]
        public decimal? EndLng { get; set; }

        [Column("duration_min")]
        public int? DurationMin { get; set; }

        [Column("distance_km", TypeName = "decimal(10,2)")]
        public decimal? DistanceKm { get; set; }

        [Column("unlock_fee", TypeName = "decimal(10,2)")]
        public decimal? UnlockFee { get; set; }

        [Column("per_minute", TypeName = "decimal(10,2)")]
        public decimal? PerMinute { get; set; }

        [Column("per_km", TypeName = "decimal(10,2)")]
        public decimal? PerKm { get; set; }

        [Column("total_amount", TypeName = "decimal(10,2)")]
        public decimal? TotalAmount { get; set; }

        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "in_progress";

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User? User { get; set; }
        public Vehicle? Vehicle { get; set; }
    }
}
