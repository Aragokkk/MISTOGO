using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;          // ← ВИПРАВЛЕНО namespace
using MistoGO.Models;        // ← ВИПРАВЛЕНО namespace

namespace MistoGO.Controllers  // ← ВИПРАВЛЕНО namespace
{
    [ApiController]
    [Route("api/vehicles")]
    public class VehiclesController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<VehiclesController> _logger;

        public VehiclesController(MistoGoContext context, ILogger<VehiclesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/vehicles
        /// Отримати список всіх транспортів з фільтрами
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles(
            [FromQuery] string? type = null,           // car, bike, scooter, moped
            [FromQuery] string? status = null,         // available, reserved, in_use
            [FromQuery] int? minBattery = null,        // Мінімальний заряд батареї
            [FromQuery] bool? isActive = true)         // Тільки активні за замовчуванням
        {
            try
            {
                var query = _context.Vehicles
                    .Include(v => v.Type)
                    .AsQueryable();

                // Фільтр за активністю
                if (isActive.HasValue)
                {
                    query = query.Where(v => v.IsActive == isActive.Value);
                }

                // Фільтр за типом
                if (!string.IsNullOrEmpty(type))
                {
                    query = query.Where(v => v.Type != null && v.Type.Code == type.ToLower());
                }

                // Фільтр за статусом
                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(v => v.Status == status.ToLower());
                }

                // Фільтр за мінімальним зарядом
                if (minBattery.HasValue)
                {
                    query = query.Where(v => v.BatteryPct >= minBattery.Value);
                }

                var vehicles = await query
                    .OrderBy(v => v.TypeId)
                    .ThenBy(v => v.Code)
                    .ToListAsync();

                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicles");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/vehicles/5
        /// Отримати деталі одного транспорту за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicle(long id)
        {
            try
            {
                var vehicle = await _context.Vehicles
                    .Include(v => v.Type)
                    .FirstOrDefaultAsync(v => v.Id == id);

                if (vehicle == null)
                {
                    return NotFound(new { message = $"Vehicle with ID {id} not found" });
                }

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicle {VehicleId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/vehicles/code/CAR001
        /// Отримати транспорт за кодом
        /// </summary>
        [HttpGet("code/{code}")]
        public async Task<ActionResult<Vehicle>> GetVehicleByCode(string code)
        {
            try
            {
                var vehicle = await _context.Vehicles
                    .Include(v => v.Type)
                    .FirstOrDefaultAsync(v => v.Code == code.ToUpper());

                if (vehicle == null)
                {
                    return NotFound(new { message = $"Vehicle with code {code} not found" });
                }

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicle with code {Code}", code);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/vehicles/nearby
        /// Отримати транспорт поблизу (в радіусі)
        /// </summary>
        [HttpGet("nearby")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetNearbyVehicles(
            [FromQuery] double lat,
            [FromQuery] double lng,
            [FromQuery] int radius = 5000) // Радіус в метрах
        {
            try
            {
                // Простий пошук в радіусі (без геопросторових розширень)
                // Приблизний розрахунок: 1 градус ≈ 111 км
                var radiusInDegrees = radius / 111000.0;

                var vehicles = await _context.Vehicles
                    .Include(v => v.Type)
                    .Where(v => v.IsActive && v.Status == "available")
                    .Where(v => v.Lat != null && v.Lng != null)
                    .Where(v =>
                        Math.Abs((double)v.Lat! - lat) <= radiusInDegrees &&
                        Math.Abs((double)v.Lng! - lng) <= radiusInDegrees)
                    .OrderBy(v => v.TypeId)
                    .ToListAsync();

                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching nearby vehicles");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// POST: api/vehicles/5/reserve
        /// Забронювати транспорт
        /// </summary>
        [HttpPost("{id}/reserve")]
        public async Task<ActionResult> ReserveVehicle(long id)
        {
            try
            {
                var vehicle = await _context.Vehicles.FindAsync(id);

                if (vehicle == null)
                {
                    return NotFound(new { message = $"Vehicle with ID {id} not found" });
                }

                if (!vehicle.IsActive)
                {
                    return BadRequest(new { message = "Vehicle is not active" });
                }

                if (vehicle.Status != "available")
                {
                    return BadRequest(new { message = $"Vehicle is not available. Current status: {vehicle.Status}" });
                }

                // Оновлюємо статус на "reserved"
                vehicle.Status = "reserved";
                vehicle.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Vehicle {VehicleId} ({Code}) reserved successfully", vehicle.Id, vehicle.Code);

                return Ok(new 
                { 
                    success = true, 
                    message = "Vehicle reserved successfully",
                    vehicleId = vehicle.Id,
                    code = vehicle.Code
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reserving vehicle {VehicleId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/vehicles/stats
        /// Статистика по транспорту
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult> GetVehicleStats()
        {
            try
            {
                var stats = await _context.Vehicles
                    .GroupBy(v => v.Type!.Name)
                    .Select(g => new
                    {
                        Type = g.Key,
                        Total = g.Count(),
                        Available = g.Count(v => v.Status == "available"),
                        Reserved = g.Count(v => v.Status == "reserved"),
                        InUse = g.Count(v => v.Status == "in_use"),
                        AverageBattery = g.Average(v => v.BatteryPct ?? 0)
                    })
                    .ToListAsync();

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicle stats");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}