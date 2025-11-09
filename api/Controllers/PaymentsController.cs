using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/payments")]  // ← Точна назва
    public class PaymentsController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(MistoGoContext context, ILogger<PaymentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/payments
        /// Отримати список всіх платежів з фільтрами
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments(
            [FromQuery] long? userId = null,
            [FromQuery] long? tripId = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var query = _context.Payments.AsQueryable();

                if (userId.HasValue)
                {
                    query = query.Where(p => p.UserId == userId.Value);
                }

                if (tripId.HasValue)
                {
                    query = query.Where(p => p.TripId == tripId.Value);
                }

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(p => p.Status == status.ToLower());
                }

                var payments = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payments");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/payments/5
        /// Отримати деталі одного платежу за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(long id)
        {
            try
            {
                var payment = await _context.Payments.FindAsync(id);

                if (payment == null)
                {
                    return NotFound(new { message = $"Payment with ID {id} not found" });
                }

                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payment {PaymentId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/payments/user/5
        /// Отримати платежі конкретного користувача
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetUserPayments(long userId)
        {
            try
            {
                var payments = await _context.Payments
                    .Where(p => p.UserId == userId)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payments for user {UserId}", userId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// POST: api/payments
        /// Створити новий платіж
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Payment>> CreatePayment(Payment payment)
        {
            try
            {
                payment.CreatedAt = DateTime.UtcNow;
                payment.Status = payment.Status?.ToLower() ?? "pending";

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Payment {PaymentId} created successfully", payment.Id);

                return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// PUT: api/payments/5
        /// Оновити існуючий платіж
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(long id, Payment payment)
        {
            if (id != payment.Id)
            {
                return BadRequest(new { message = "Payment ID mismatch" });
            }

            try
            {
                var existingPayment = await _context.Payments.FindAsync(id);
                if (existingPayment == null)
                {
                    return NotFound(new { message = $"Payment with ID {id} not found" });
                }

                existingPayment.Status = payment.Status?.ToLower();
                existingPayment.Amount = payment.Amount;
                existingPayment.Currency = payment.Currency;
                existingPayment.TripId = payment.TripId;
                existingPayment.ProcessedAt = payment.ProcessedAt;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Payment {PaymentId} updated successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment {PaymentId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// DELETE: api/payments/5
        /// Видалити платіж
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(long id)
        {
            try
            {
                var payment = await _context.Payments.FindAsync(id);
                if (payment == null)
                {
                    return NotFound(new { message = $"Payment with ID {id} not found" });
                }

                _context.Payments.Remove(payment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Payment {PaymentId} deleted successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting payment {PaymentId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/payments/stats
        /// Статистика по платежам
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult> GetPaymentStats()
        {
            try
            {
                var totalPayments = await _context.Payments.CountAsync();
                var successfulPayments = await _context.Payments.CountAsync(p => p.Status == "completed");
                var pendingPayments = await _context.Payments.CountAsync(p => p.Status == "pending");
                var totalAmount = await _context.Payments
                    .Where(p => p.Status == "completed")
                    .SumAsync(p => (decimal?)p.Amount) ?? 0;

                var stats = new
                {
                    TotalPayments = totalPayments,
                    SuccessfulPayments = successfulPayments,
                    PendingPayments = pendingPayments,
                    TotalAmount = totalAmount,
                    AverageAmount = successfulPayments > 0 ? totalAmount / successfulPayments : 0
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payment stats");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}