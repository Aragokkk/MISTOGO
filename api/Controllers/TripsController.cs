using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/trips")]
    public class TripsController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<TripsController> _logger;

        public TripsController(MistoGoContext context, ILogger<TripsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips(
            [FromQuery] long? userId = null,
            [FromQuery] long? vehicleId = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var query = _context.Trips
                    .Include(t => t.User)
                    .Include(t => t.Vehicle)
                    .AsQueryable();

                if (userId.HasValue)
                    query = query.Where(t => t.UserId == userId.Value);

                if (vehicleId.HasValue)
                    query = query.Where(t => t.VehicleId == vehicleId.Value);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(t => t.Status == status.ToLower());

                var trips = await query.OrderByDescending(t => t.StartTime).ToListAsync();
                return Ok(trips);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching trips");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(long id)
        {
            try
            {
                var trip = await _context.Trips
                    .Include(t => t.User)
                    .Include(t => t.Vehicle)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (trip == null)
                    return NotFound(new { message = $"Trip {id} not found" });

                return Ok(trip);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching trip {TripId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Trip>> CreateTrip(Trip trip)
        {
            try
            {
                trip.StartTime = DateTime.UtcNow;
                trip.Status = "in_progress";
                trip.CreatedAt = DateTime.UtcNow;

                _context.Trips.Add(trip);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, trip);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating trip");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(long id, Trip trip)
        {
            if (id != trip.Id)
                return BadRequest(new { message = "ID mismatch" });

            try
            {
                var existing = await _context.Trips.FindAsync(id);
                if (existing == null)
                    return NotFound();

                existing.EndTime = trip.EndTime;
                existing.EndLat = trip.EndLat;
                existing.EndLng = trip.EndLng;
                existing.DurationMin = trip.DurationMin;
                existing.DistanceKm = trip.DistanceKm;
                existing.TotalAmount = trip.TotalAmount;
                existing.Status = trip.Status;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating trip");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(long id)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(id);
                if (trip == null)
                    return NotFound();

                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting trip");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
