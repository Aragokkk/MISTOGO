using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("vehicles")]
    public class Vehicle
    {
        [Key] [Column("id")] public long Id { get; set; }

        [Column("type_id")] public byte TypeId { get; set; }

        [Required, MaxLength(50)] [Column("code")] public string Code { get; set; } = null!;
        [MaxLength(80)]  [Column("display_name")] public string? DisplayName { get; set; }
        [MaxLength(50)]  [Column("brand")] public string? Brand { get; set; }
        [MaxLength(50)]  [Column("model")] public string? Model { get; set; }
        [Column("year")] public short? Year { get; set; }
        [MaxLength(30)]  [Column("color")] public string? Color { get; set; }
        [MaxLength(20)]  [Column("registration_number")] public string? RegistrationNumber { get; set; }

        [MaxLength(100)] [Column("qr_code")] public string? QrCode { get; set; }
        [MaxLength(255)] [Column("photo_url")] public string? PhotoUrl { get; set; }
        [Column("photos")] public string? Photos { get; set; } // JSON array: ["url1", "url2", ...]

        [Column("unlock_fee",  TypeName = "decimal(10,2)")] public decimal? UnlockFee { get; set; }
        [Column("per_minute",  TypeName = "decimal(10,2)")] public decimal? PerMinute { get; set; }
        [Column("per_km",      TypeName = "decimal(10,2)")] public decimal? PerKm { get; set; }

        // Технічні характеристики
        [MaxLength(50)] [Column("transmission")] public string? Transmission { get; set; }
        [MaxLength(30)] [Column("seat_material")] public string? SeatMaterial { get; set; }

        // Електроніка та комфорт (Boolean)
        [Column("has_usb")] public bool HasUsb { get; set; } = false;
        [Column("has_bluetooth")] public bool HasBluetooth { get; set; } = false;
        [Column("has_camera")] public bool HasCamera { get; set; } = false;
        [Column("has_air_conditioning")] public bool HasAirConditioning { get; set; } = false;
        [Column("has_heated_seats")] public bool HasHeatedSeats { get; set; } = false;
        [Column("has_gps")] public bool HasGps { get; set; } = false;
        [Column("has_parking_sensors")] public bool HasParkingSensors { get; set; } = false;

        // Описи (TEXT)
        [Column("description_dynamics")] public string? DescriptionDynamics { get; set; }
        [Column("description_engine")] public string? DescriptionEngine { get; set; }
        [Column("description_transmission")] public string? DescriptionTransmission { get; set; }

        [MaxLength(20)] [Column("status")] public string Status { get; set; } = "available";

        [Column("lat", TypeName = "decimal(9,6)")] public decimal? Lat { get; set; }
        [Column("lng", TypeName = "decimal(9,6)")] public decimal? Lng { get; set; }

        [Column("battery_pct")] public byte? BatteryPct { get; set; }
        [Column("fuel_pct")]    public byte? FuelPct { get; set; }
        [Column("max_speed")]   public short? MaxSpeed { get; set; }  // ← НОВИЙ РЯДОК

        [Column("total_trips")] public int TotalTrips { get; set; } = 0;
        [Column("total_km", TypeName = "decimal(10,2)")] public decimal TotalKm { get; set; } = 0m;

        [Column("is_active")] public bool IsActive { get; set; } = true;

        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Column("updated_at")] public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public VehicleType? Type { get; set; }
    }
}