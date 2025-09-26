using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("zones")]
    public class Zone
    {
        [Key] [Column("id")] public int Id { get; set; }

        [MaxLength(80)] [Column("name")] public string? Name { get; set; }
        [MaxLength(20)] [Column("zone_type")] public string? ZoneType { get; set; }

        [Column("geojson", TypeName = "text")] public string? GeoJson { get; set; }

        [Column("center_lat", TypeName = "decimal(9,6)")] public decimal? CenterLat { get; set; }
        [Column("center_lng", TypeName = "decimal(9,6)")] public decimal? CenterLng { get; set; }
        [Column("radius_m")] public int? RadiusM { get; set; }

        [Column("is_active")] public bool IsActive { get; set; } = true;

        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
