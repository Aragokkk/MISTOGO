using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MistoGO.Models
{
    [Table("password_resets")]
    [Index(nameof(UserId))]
    [Index(nameof(Token), IsUnique = true)]
    public class PasswordReset
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [Required, MaxLength(100)]
        [Column("token")]
        public string Token { get; set; } = null!;

        [Column("expires_at")]
        public DateTime ExpiresAt { get; set; } // зберігаємо як UTC

        [Column("used")]
        public bool Used { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }
    }
}
