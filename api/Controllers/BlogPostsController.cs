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

        // GET: api/blog_posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts()
        {
            var posts = await _context.BlogPosts
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(posts);
        }

        // GET: api/blog_posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> GetBlogPost(long id)
        {
            var post = await _context.BlogPosts.FindAsync(id);

            if (post == null)
                return NotFound(new { message = $"Blog post with ID {id} not found" });

            post.ViewsCount++;
            await _context.SaveChangesAsync();

            return Ok(post);
        }

        // POST: api/blog_posts
        [HttpPost]
        public async Task<ActionResult<BlogPost>> CreateBlogPost([FromBody] BlogPost post)
        {
            try
            {
                post.Id = 0;
                post.CreatedAt = DateTime.UtcNow;
                post.UpdatedAt = DateTime.UtcNow;
                post.ViewsCount = 0;

                // нормализуем теги: если пришли как "a,b" — сделаем ["a","b"]
                if (!string.IsNullOrEmpty(post.Tags) && !post.Tags.Trim().StartsWith("["))
                {
                    var tagsArray = post.Tags
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(t => t.Trim())
                        .ToArray();
                    post.Tags = System.Text.Json.JsonSerializer.Serialize(tagsArray);
                }

                _context.BlogPosts.Add(post);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBlogPost), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // PUT: api/blog_posts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlogPost(long id, [FromBody] BlogPost updated)
        {
            if (id != updated.Id)
                return BadRequest(new { message = "Blog post ID mismatch" });

            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null)
                return NotFound(new { message = $"Blog post with ID {id} not found" });

            post.Title = updated.Title;
            post.Excerpt = updated.Excerpt;
            post.Body = updated.Body;
            post.Category = updated.Category;
            post.Status = updated.Status;
            post.ImageUrl = updated.ImageUrl;
            post.UpdatedAt = DateTime.UtcNow;

            // теги
            if (!string.IsNullOrEmpty(updated.Tags) && !updated.Tags.Trim().StartsWith("["))
            {
                var tagsArray = updated.Tags
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(t => t.Trim())
                    .ToArray();
                post.Tags = System.Text.Json.JsonSerializer.Serialize(tagsArray);
            }
            else
            {
                post.Tags = updated.Tags;
            }

            await _context.SaveChangesAsync();
            return Ok(post);
        }

        // DELETE: api/blog_posts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost(long id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null)
                return NotFound();

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
