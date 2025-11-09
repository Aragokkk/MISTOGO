using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
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
            [FromQuery] string? type = null,
            [FromQuery] string? status = null,
            [FromQuery] int? minBattery = null,
            [FromQuery] bool? isActive = true)
        {
            try
            {
                var query = _context.Vehicles
                    .Include(v => v.Type)
                    .AsQueryable();

                if (isActive.HasValue)
                {
                    query = query.Where(v => v.IsActive == isActive.Value);
                }

                if (!string.IsNullOrEmpty(type))
                {
                    query = query.Where(v => v.Type != null && v.Type.Code == type.ToLower());
                }

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(v => v.Status == status.ToLower());
                }

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
            [FromQuery] int radius = 5000)
        {
            try
            {
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

        // 🟢 CREATE - Додати новий транспорт
        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] Vehicle vehicle)
        {
            try
            {
                vehicle.CreatedAt = DateTime.UtcNow;
                vehicle.UpdatedAt = DateTime.UtcNow;
                
                _context.Vehicles.Add(vehicle);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Vehicle created: {VehicleId} ({Code})", vehicle.Id, vehicle.Code);

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating vehicle");
                return BadRequest(new { message = ex.Message });
            }
        }

        // 🟠 UPDATE - Оновити транспорт
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(long id, [FromBody] Vehicle updatedVehicle)
        {
            try
            {
                var vehicle = await _context.Vehicles.FindAsync(id);
                if (vehicle == null)
                    return NotFound(new { message = "Транспорт не знайдено" });

                vehicle.Code = updatedVehicle.Code ?? vehicle.Code;
                vehicle.DisplayName = updatedVehicle.DisplayName ?? vehicle.DisplayName;
                vehicle.Brand = updatedVehicle.Brand ?? vehicle.Brand;
                vehicle.Model = updatedVehicle.Model ?? vehicle.Model;
                vehicle.Year = updatedVehicle.Year;
                vehicle.Color = updatedVehicle.Color ?? vehicle.Color;
                vehicle.Status = updatedVehicle.Status ?? vehicle.Status;
                vehicle.BatteryPct = updatedVehicle.BatteryPct;
                vehicle.UnlockFee = updatedVehicle.UnlockFee;
                vehicle.PerMinute = updatedVehicle.PerMinute;
                vehicle.Lat = updatedVehicle.Lat;
                vehicle.Lng = updatedVehicle.Lng;
                vehicle.IsActive = updatedVehicle.IsActive;
                vehicle.TypeId = updatedVehicle.TypeId;
                vehicle.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Vehicle updated: {VehicleId} ({Code})", vehicle.Id, vehicle.Code);

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating vehicle {VehicleId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        // 🔴 DELETE - Видалити транспорт
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(long id)
        {
            try
            {
                var vehicle = await _context.Vehicles.FindAsync(id);
                if (vehicle == null)
                    return NotFound(new { message = "Транспорт не знайдено" });

                _context.Vehicles.Remove(vehicle);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Vehicle deleted: {VehicleId} ({Code})", id, vehicle.Code);

                return Ok(new { message = "Видалено успішно" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting vehicle {VehicleId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        // 📸 UPLOAD IMAGE - Завантажити картинку
        [HttpPost("{id}/upload-image")]
        public async Task<IActionResult> UploadImage(long id, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { message = "Файл не надано" });

                var vehicle = await _context.Vehicles.FindAsync(id);
                if (vehicle == null)
                    return NotFound(new { message = "Транспорт не знайдено" });

                // Створюємо папку uploads якщо немає
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "vehicles");
                Directory.CreateDirectory(uploadsPath);

                // Генеруємо унікальне ім'я файлу
                var fileName = $"{id}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Зберігаємо файл
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Оновлюємо URL в БД
                var imageUrl = $"/uploads/vehicles/{fileName}";
                vehicle.PhotoUrl = imageUrl;  
                vehicle.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Image uploaded for vehicle {VehicleId}: {ImageUrl}", id, imageUrl);

                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image for vehicle {VehicleId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}