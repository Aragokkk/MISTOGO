using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("vehicle_types")]
    public class VehicleType
    {
        [Key] [Column("id")] public byte Id { get; set; }

        [Required, MaxLength(20)] [Column("code")] public string Code { get; set; } = null!;
        [MaxLength(50)] [Column("name")] public string? Name { get; set; }
        [MaxLength(255)] [Column("icon_url")] public string? IconUrl { get; set; }

        [Column("requires_license")] public bool RequiresLicense { get; set; } = false;
        [Column("min_age")] public byte? MinAge { get; set; }
        [Column("max_speed_kmh")] public short? MaxSpeedKmh { get; set; }

        [Column("is_active")] public bool IsActive { get; set; } = true;
        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
