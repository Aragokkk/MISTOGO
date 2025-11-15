using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/vehicle_types")]  // ← Точна назва
    public class VehicleTypesController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<VehicleTypesController> _logger;

        public VehicleTypesController(MistoGoContext context, ILogger<VehicleTypesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/vehicle_types
        /// Отримати список всіх типів транспорту
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleType>>> GetVehicleTypes([FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.VehicleTypes.AsQueryable();

                if (isActive.HasValue)
                {
                    query = query.Where(vt => vt.IsActive == isActive.Value);
                }

                var vehicleTypes = await query
                    .OrderBy(vt => vt.Name)
                    .ToListAsync();

                return Ok(vehicleTypes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicle types");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/vehicle_types/5
        /// Отримати деталі одного типу за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleType>> GetVehicleType(int id)
        {
            try
            {
                var vehicleType = await _context.VehicleTypes.FindAsync(id);

                if (vehicleType == null)
                {
                    return NotFound(new { message = $"Vehicle type with ID {id} not found" });
                }

                return Ok(vehicleType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicle type {VehicleTypeId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/vehicle_types/code/car
        /// Отримати тип за кодом
        /// </summary>
        [HttpGet("code/{code}")]
        public async Task<ActionResult<VehicleType>> GetVehicleTypeByCode(string code)
        {
            try
            {
                var vehicleType = await _context.VehicleTypes
                    .FirstOrDefaultAsync(vt => vt.Code == code.ToLower());

                if (vehicleType == null)
                {
                    return NotFound(new { message = $"Vehicle type with code {code} not found" });
                }

                return Ok(vehicleType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicle type with code {Code}", code);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// POST: api/vehicle_types
        /// Створити новий тип транспорту
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<VehicleType>> CreateVehicleType(VehicleType vehicleType)
        {
            try
            {
                // Перевірка чи існує тип з таким кодом
                if (await _context.VehicleTypes.AnyAsync(vt => vt.Code == vehicleType.Code.ToLower()))
                {
                    return BadRequest(new { message = "Vehicle type with this code already exists" });
                }

                vehicleType.Code = vehicleType.Code.ToLower();
                vehicleType.CreatedAt = DateTime.UtcNow;

                _context.VehicleTypes.Add(vehicleType);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Vehicle type {VehicleTypeId} ({Name}) created successfully", 
                    vehicleType.Id, vehicleType.Name);

                return CreatedAtAction(nameof(GetVehicleType), new { id = vehicleType.Id }, vehicleType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating vehicle type");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// PUT: api/vehicle_types/5
        /// Оновити існуючий тип транспорту
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicleType(byte id, VehicleType vehicleType)
        {
            if (id != vehicleType.Id)
            {
                return BadRequest(new { message = "Vehicle type ID mismatch" });
            }

            try
            {
                var existingType = await _context.VehicleTypes.FindAsync(id);
                if (existingType == null)
                {
                    return NotFound(new { message = $"Vehicle type with ID {id} not found" });
                }

                existingType.Name = vehicleType.Name;
                existingType.IconUrl = vehicleType.IconUrl;
                existingType.RequiresLicense = vehicleType.RequiresLicense;
                existingType.MinAge = vehicleType.MinAge;
                existingType.MaxSpeedKmh = vehicleType.MaxSpeedKmh;
                existingType.IsActive = vehicleType.IsActive;
                // Code не змінюємо

                await _context.SaveChangesAsync();

                _logger.LogInformation("Vehicle type {VehicleTypeId} updated successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating vehicle type {VehicleTypeId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// DELETE: api/vehicle_types/5
        /// Видалити тип транспорту
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicleType(int id)
        {
            try
            {
                var vehicleType = await _context.VehicleTypes.FindAsync(id);
                if (vehicleType == null)
                {
                    return NotFound(new { message = $"Vehicle type with ID {id} not found" });
                }

                // Перевірка чи є транспорт цього типу
                var hasVehicles = await _context.Vehicles.AnyAsync(v => v.TypeId == id);
                if (hasVehicles)
                {
                    return BadRequest(new { message = "Cannot delete vehicle type with associated vehicles" });
                }

                _context.VehicleTypes.Remove(vehicleType);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Vehicle type {VehicleTypeId} deleted successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting vehicle type {VehicleTypeId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}