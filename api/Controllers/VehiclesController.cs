using Microsoft.AspNetCore.Mvc;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        [HttpGet("nearby")]
        public IActionResult GetNearbyVehicles(double lat, double lng, int radius = 5000)
        {
            // TODO: Реалізувати пошук транспорту
            var mockVehicles = new[]
            {
                new { id = 1, type = "car", lat = 50.4501, lng = 30.5234, price = 6, available = true },
                new { id = 2, type = "scooter", lat = 50.4521, lng = 30.5254, price = 3, available = true },
                new { id = 3, type = "bicycle", lat = 50.4461, lng = 30.5214, price = 2, available = false }
            };
            
            return Ok(mockVehicles);
        }

        [HttpGet("{id}")]
        public IActionResult GetVehicle(int id)
        {
            // TODO: Реалізувати отримання деталей
            var mockVehicle = new {
                id = id,
                type = "car",
                make = "Toyota",
                model = "Corolla",
                pricePerMinute = 6,
                unlockFee = 20,
                batteryPercent = 85
            };
            
            return Ok(mockVehicle);
        }
    }
}