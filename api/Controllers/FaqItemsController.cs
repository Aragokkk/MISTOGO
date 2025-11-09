using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/faq_items")]  // ← Точна назва з підкресленням як в БД
    public class FaqItemsController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<FaqItemsController> _logger;

        public FaqItemsController(MistoGoContext context, ILogger<FaqItemsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/faqitems
        /// Отримати список всіх FAQ з фільтрами
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FaqItem>>> GetFaqItems(
            [FromQuery] string? category = null,
            [FromQuery] bool? isActive = true)
        {
            try
            {
                var query = _context.FaqItems.AsQueryable();

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(f => f.Category == category.ToLower());
                }

                if (isActive.HasValue)
                {
                    query = query.Where(f => f.IsActive == isActive.Value);
                }

                var faqItems = await query
                    .OrderBy(f => f.OrderPosition)
                    .ThenByDescending(f => f.CreatedAt)
                    .ToListAsync();

                return Ok(faqItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching FAQ items");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/faqitems/5
        /// Отримати деталі одного FAQ за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<FaqItem>> GetFaqItem(int id)
        {
            try
            {
                var faqItem = await _context.FaqItems.FindAsync(id);

                if (faqItem == null)
                {
                    return NotFound(new { message = $"FAQ item with ID {id} not found" });
                }

                return Ok(faqItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching FAQ item {FaqItemId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/faqitems/category/general
        /// Отримати FAQ за категорією
        /// </summary>
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<FaqItem>>> GetFaqItemsByCategory(string category)
        {
            try
            {
                var faqItems = await _context.FaqItems
                    .Where(f => f.Category == category.ToLower() && f.IsActive)
                    .OrderBy(f => f.OrderPosition)
                    .ToListAsync();

                return Ok(faqItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching FAQ items for category {Category}", category);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// POST: api/faqitems
        /// Створити новий FAQ
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<FaqItem>> CreateFaqItem(FaqItem faqItem)
        {
            try
            {
                faqItem.CreatedAt = DateTime.UtcNow;
                faqItem.UpdatedAt = DateTime.UtcNow;

                if (string.IsNullOrEmpty(faqItem.Category))
                {
                    faqItem.Category = "general";
                }
                else
                {
                    faqItem.Category = faqItem.Category.ToLower();
                }

                _context.FaqItems.Add(faqItem);
                await _context.SaveChangesAsync();

                _logger.LogInformation("FAQ item {FaqItemId} created successfully", faqItem.Id);

                return CreatedAtAction(nameof(GetFaqItem), new { id = faqItem.Id }, faqItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating FAQ item");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// PUT: api/faqitems/5
        /// Оновити існуючий FAQ
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFaqItem(int id, FaqItem faqItem)
        {
            if (id != faqItem.Id)
            {
                return BadRequest(new { message = "FAQ item ID mismatch" });
            }

            try
            {
                var existingFaqItem = await _context.FaqItems.FindAsync(id);
                if (existingFaqItem == null)
                {
                    return NotFound(new { message = $"FAQ item with ID {id} not found" });
                }

                existingFaqItem.Question = faqItem.Question;
                existingFaqItem.Answer = faqItem.Answer;
                existingFaqItem.Category = faqItem.Category?.ToLower();
                existingFaqItem.OrderPosition = faqItem.OrderPosition;
                existingFaqItem.IsActive = faqItem.IsActive;
                existingFaqItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("FAQ item {FaqItemId} updated successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating FAQ item {FaqItemId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// DELETE: api/faqitems/5
        /// Видалити FAQ
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFaqItem(int id)
        {
            try
            {
                var faqItem = await _context.FaqItems.FindAsync(id);
                if (faqItem == null)
                {
                    return NotFound(new { message = $"FAQ item with ID {id} not found" });
                }

                _context.FaqItems.Remove(faqItem);
                await _context.SaveChangesAsync();

                _logger.LogInformation("FAQ item {FaqItemId} deleted successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting FAQ item {FaqItemId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/faqitems/categories
        /// Отримати список всіх категорій FAQ
        /// </summary>
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            try
            {
                var categories = await _context.FaqItems
                    .Where(f => f.IsActive)
                    .Select(f => f.Category)
                    .Distinct()
                    .OrderBy(c => c)
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching FAQ categories");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}