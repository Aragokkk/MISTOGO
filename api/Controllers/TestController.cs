using Microsoft.AspNetCore.Mvc;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { message = "MistoGO працює!", timestamp = DateTime.UtcNow });
        }
        
        [HttpGet("info")]
        public IActionResult Info()
        {
            return Ok(new {
                name = "MistoGO API",
                version = "1.0",
                description = "Мультимодальний сервіс оренди транспорту",
                supportedVehicles = new[] { "car", "moped", "scooter", "bicycle" }
            });
        }
    }
}