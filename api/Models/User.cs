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
        [MaxLength(255)] [Column("password_hash")] public string? PasswordHash { get; set; }
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

        // ===== НОВІ ПОЛЯ ДЛЯ СИСТЕМИ ВОДІЙСЬКИХ ПОСВІДЧЕНЬ =====
        [MaxLength(20)] [Column("license_status")] 
        public string LicenseStatus { get; set; } = "none"; // none/pending/verified/rejected
        
        [MaxLength(255)] [Column("license_document_url")] 
        public string? LicenseDocumentUrl { get; set; }
        
        [Column("license_submitted_at")] 
        public DateTime? LicenseSubmittedAt { get; set; }
        
        [Column("license_verified_at")] 
        public DateTime? LicenseVerifiedAt { get; set; }
        
        [MaxLength(500)] [Column("license_reject_reason")] 
        public string? LicenseRejectReason { get; set; }

        // ===== ФОТО ПРОФІЛЮ =====
        [MaxLength(255)] [Column("profile_photo_url")] 
        public string? ProfilePhotoUrl { get; set; }
    }
}