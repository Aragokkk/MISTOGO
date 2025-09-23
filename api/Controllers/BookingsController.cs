using Microsoft.AspNetCore.Mvc;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateBooking([FromBody] object request)
        {
            // TODO: Реалізувати створення бронювання
            return Ok(new { bookingId = 1, status = "pending", message = "Booking created" });
        }

        [HttpPost("{id}/start")]
        public IActionResult StartTrip(int id)
        {
            // TODO: Реалізувати початок поїздки
            return Ok(new { bookingId = id, status = "active", startTime = DateTime.UtcNow });
        }

        [HttpPost("{id}/stop")]
        public IActionResult StopTrip(int id)
        {
            // TODO: Реалізувати завершення поїздки
            return Ok(new { 
                bookingId = id, 
                status = "completed", 
                duration = 15, 
                totalPrice = 110 
            });
        }

        [HttpGet("history")]
        public IActionResult GetHistory()
        {
            // TODO: Реалізувати історію поїздок
            var mockHistory = new[]
            {
                new { id = 1, vehicleType = "car", date = "2025-09-14", duration = 25, price = 170 },
                new { id = 2, vehicleType = "scooter", date = "2025-09-13", duration = 8, price = 34 }
            };
            
            return Ok(mockHistory);
        }
    }
}