using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("users")]
    public class User
    {
        [Key] [Column("id")] public long Id { get; set; }

        [Required, MaxLength(120)] [Column("email")] public string Email { get; set; } = null!;
        [Required, MaxLength(255)] [Column("password_hash")] public string PasswordHash { get; set; } = null!;

        [MaxLength(120)] [Column("full_name")] public string? FullName { get; set; }
        [MaxLength(20)]  [Column("phone")]     public string? Phone { get; set; }

        [Column("phone_verified")]  public bool PhoneVerified { get; set; } = false;
        [MaxLength(50)] [Column("driver_license")] public string? DriverLicense { get; set; }
        [Column("license_verified")] public bool LicenseVerified { get; set; } = false;

        [Column("balance", TypeName = "decimal(10,2)")] public decimal Balance { get; set; } = 0.00m;

        [MaxLength(20)] [Column("role")] public string Role { get; set; } = "user";
        [Column("is_active")]  public bool IsActive { get; set; } = true;
        [Column("is_blocked")] public bool IsBlocked { get; set; } = false;

        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Column("updated_at")] public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
