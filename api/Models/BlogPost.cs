using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MistoGO.Models
{
    [Table("blog_posts")]
    public class BlogPost
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [MaxLength(120)]
        [Column("slug")]
        public string? Slug { get; set; }

        [MaxLength(200)]
        [Column("title")]
        public string? Title { get; set; }

        [Column("excerpt", TypeName = "text")]
        public string? Excerpt { get; set; }

        [Column("body", TypeName = "text")]
        public string? Body { get; set; }

        [Column("author_id")]
        public long? AuthorId { get; set; }

        [MaxLength(30)]
        [Column("category")]
        public string? Category { get; set; }

        [Column("tags", TypeName = "json")]
        public string? Tags { get; set; }

        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "draft";

        [Column("views_count")]
        public int ViewsCount { get; set; } = 0;

        [Column("published_at")]
        public DateTime? PublishedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // 🖼️ Новое поле для изображения (важно!)
        [MaxLength(500)]
        [Column("image_url")]
        public string? ImageUrl { get; set; }

        // 👤 Автор поста (опционально)
        public User? Author { get; set; }
    }
}
