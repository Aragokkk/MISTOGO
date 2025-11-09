using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/zones")]
    public class ZonesController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<ZonesController> _logger;

        public ZonesController(MistoGoContext context, ILogger<ZonesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/zones
        /// Отримати список всіх зон паркування
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zone>>> GetZones([FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.Zones.AsQueryable();

                if (isActive.HasValue)
                {
                    query = query.Where(z => z.IsActive == isActive.Value);
                }

                var zones = await query
                    .OrderBy(z => z.Name)
                    .ToListAsync();

                return Ok(zones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching zones");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/zones/5
        /// Отримати деталі однієї зони за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Zone>> GetZone(int id)
        {
            try
            {
                var zone = await _context.Zones.FindAsync(id);

                if (zone == null)
                {
                    return NotFound(new { message = $"Zone with ID {id} not found" });
                }

                return Ok(zone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching zone {ZoneId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// POST: api/zones
        /// Створити нову зону
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Zone>> CreateZone(Zone zone)
        {
            try
            {
                zone.CreatedAt = DateTime.UtcNow;

                _context.Zones.Add(zone);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Zone {ZoneId} ({Name}) created successfully", zone.Id, zone.Name);

                return CreatedAtAction(nameof(GetZone), new { id = zone.Id }, zone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating zone");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// PUT: api/zones/5
        /// Оновити існуючу зону
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateZone(int id, Zone zone)
        {
            if (id != zone.Id)
            {
                return BadRequest(new { message = "Zone ID mismatch" });
            }

            try
            {
                _context.Entry(zone).State = EntityState.Modified;
                
                // CreatedAt не змінюємо
                _context.Entry(zone).Property(z => z.CreatedAt).IsModified = false;
                
                await _context.SaveChangesAsync();

                _logger.LogInformation("Zone {ZoneId} updated successfully", id);

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ZoneExists(id))
                {
                    return NotFound(new { message = $"Zone with ID {id} not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating zone {ZoneId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// DELETE: api/zones/5
        /// Видалити зону
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZone(int id)
        {
            try
            {
                var zone = await _context.Zones.FindAsync(id);
                if (zone == null)
                {
                    return NotFound(new { message = $"Zone with ID {id} not found" });
                }

                _context.Zones.Remove(zone);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Zone {ZoneId} deleted successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting zone {ZoneId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        private async Task<bool> ZoneExists(int id)
        {
            return await _context.Zones.AnyAsync(e => e.Id == id);
        }
    }
}