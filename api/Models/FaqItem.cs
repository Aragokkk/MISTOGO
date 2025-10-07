using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("faq_items")]
    public class FaqItem
    {
        [Key] [Column("id")] public int Id { get; set; }

        [MaxLength(255)] [Column("question")] public string? Question { get; set; }
        [Column("answer", TypeName = "text")] public string? Answer { get; set; }

        [MaxLength(30)] [Column("category")] public string? Category { get; set; }
        [Column("order_position")] public int OrderPosition { get; set; } = 0;

        [Column("is_active")] public bool IsActive { get; set; } = true;

        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Column("updated_at")] public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
