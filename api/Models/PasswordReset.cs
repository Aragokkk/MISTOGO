using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("password_resets")]
    public class PasswordReset
    {
        [Key] [Column("id")] public long Id { get; set; }

        [Column("user_id")] public long UserId { get; set; }

        [Required, MaxLength(100)] [Column("token")] public string Token { get; set; } = null!;

        [Column("expires_at")] public DateTime ExpiresAt { get; set; }
        [Column("used")] public bool Used { get; set; } = false;
        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // навігація (не обов’язкова для baseline, але корисна)
        public User? User { get; set; }
    }
}
