using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/blog_posts")]
    public class BlogPostsController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<BlogPostsController> _logger;

        public BlogPostsController(MistoGoContext context, ILogger<BlogPostsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/blog
        /// Отримати список всіх постів
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts(
            [FromQuery] string? status = null,
            [FromQuery] long? authorId = null)
        {
            try
            {
                var query = _context.BlogPosts.AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(p => p.Status == status);
                }

                if (authorId.HasValue)
                {
                    query = query.Where(p => p.AuthorId == authorId.Value);
                }

                var posts = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching blog posts");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/blog/5
        /// Отримати деталі одного поста за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> GetBlogPost(long id)
        {
            try
            {
                var post = await _context.BlogPosts.FindAsync(id);

                if (post == null)
                {
                    return NotFound(new { message = $"Blog post with ID {id} not found" });
                }

                // Збільшуємо лічильник переглядів
                post.ViewsCount++;
                await _context.SaveChangesAsync();

                return Ok(post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching blog post {PostId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/blog/slug/my-post-slug
        /// Отримати пост за slug
        /// </summary>
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<BlogPost>> GetBlogPostBySlug(string slug)
        {
            try
            {
                var post = await _context.BlogPosts
                    .FirstOrDefaultAsync(p => p.Slug == slug);

                if (post == null)
                {
                    return NotFound(new { message = $"Blog post with slug '{slug}' not found" });
                }

                // Збільшуємо лічильник переглядів
                post.ViewsCount++;
                await _context.SaveChangesAsync();

                return Ok(post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching blog post with slug {Slug}", slug);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// POST: api/blog
        /// Створити новий пост
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<BlogPost>> CreateBlogPost(BlogPost post)
        {
            try
            {
                post.CreatedAt = DateTime.UtcNow;
                post.UpdatedAt = DateTime.UtcNow;
                post.ViewsCount = 0;

                _context.BlogPosts.Add(post);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Blog post {PostId} ({Title}) created successfully", post.Id, post.Title);

                return CreatedAtAction(nameof(GetBlogPost), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// PUT: api/blog/5
        /// Оновити існуючий пост
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlogPost(long id, BlogPost post)
        {
            if (id != post.Id)
            {
                return BadRequest(new { message = "Blog post ID mismatch" });
            }

            try
            {
                post.UpdatedAt = DateTime.UtcNow;
                _context.Entry(post).State = EntityState.Modified;
                
                // Не змінюємо CreatedAt та ViewsCount
                _context.Entry(post).Property(p => p.CreatedAt).IsModified = false;
                _context.Entry(post).Property(p => p.ViewsCount).IsModified = false;
                
                await _context.SaveChangesAsync();

                _logger.LogInformation("Blog post {PostId} updated successfully", id);

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await BlogPostExists(id))
                {
                    return NotFound(new { message = $"Blog post with ID {id} not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating blog post {PostId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// DELETE: api/blog/5
        /// Видалити пост
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost(long id)
        {
            try
            {
                var post = await _context.BlogPosts.FindAsync(id);
                if (post == null)
                {
                    return NotFound(new { message = $"Blog post with ID {id} not found" });
                }

                _context.BlogPosts.Remove(post);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Blog post {PostId} deleted successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog post {PostId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        private async Task<bool> BlogPostExists(long id)
        {
            return await _context.BlogPosts.AnyAsync(e => e.Id == id);
        }
    }
}