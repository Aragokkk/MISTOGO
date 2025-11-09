using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<PaymentController> _logger;
        private readonly IConfiguration _configuration;
        
        private const string MERCHANT_ACCOUNT = "test_merch_n1";
        private const string MERCHANT_SECRET_KEY = "flk3409refn54t54t*FNJRET";

        public PaymentController(MistoGoContext context, ILogger<PaymentController> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        // ============================================
        // 🎯 WAYFORPAY INTEGRATION
        // ============================================

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                var orderReference = $"ORDER_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}_{request.UserId}";
                var orderDate = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

                var payment = new Payment
                {
                    UserId = request.UserId,
                    TripId = request.TripId,
                    Amount = request.Amount,
                    Currency = request.Currency,
                    Status = "pending",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"💾 Payment created: ID={payment.Id}");

                var signatureString = string.Join(";", 
                    MERCHANT_ACCOUNT,
                    request.MerchantDomainName,
                    orderReference,
                    orderDate.ToString(),
                    request.Amount.ToString("F2"),
                    request.Currency,
                    request.ProductName,
                    "1",
                    request.Amount.ToString("F2")
                );

                var signature = GenerateHmacSha1(signatureString, MERCHANT_SECRET_KEY);

                var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
                var backendUrl = _configuration["AppSettings:BackendUrl"] ?? "http://localhost:5000";

                var response = new
                {
                    merchantAccount = MERCHANT_ACCOUNT,
                    merchantDomainName = request.MerchantDomainName,
                    orderReference = orderReference,
                    orderDate = orderDate,
                    amount = request.Amount,
                    currency = request.Currency,
                    productName = new[] { request.ProductName },
                    productCount = new[] { 1 },
                    productPrice = new[] { request.Amount },
                    merchantSignature = signature,
                    returnUrl = request.ReturnUrl ?? $"{frontendUrl}/payment/success",
                    serviceUrl = $"{backendUrl}/api/payment/callback",
                    paymentId = payment.Id
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating payment");
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("callback")]
        public async Task<IActionResult> PaymentCallback([FromBody] PaymentCallbackRequest callback)
        {
            try
            {
                _logger.LogInformation($"💳 Callback: {callback.OrderReference} - {callback.TransactionStatus}");

                var payment = await _context.Payments
                    .Where(p => p.Status == "pending")
                    .OrderByDescending(p => p.CreatedAt)
                    .FirstOrDefaultAsync();

                if (payment != null)
                {
                    payment.Status = callback.TransactionStatus.ToLower() == "approved" ? "completed" : "failed";
                    payment.ProcessedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    
                    _logger.LogInformation($"✅ Payment {payment.Id} updated: {payment.Status}");
                }

                return Ok(new { orderReference = callback.OrderReference, status = "accept" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Callback error");
                return BadRequest(new { error = ex.Message });
            }
        }

        // ============================================
        // 📊 CRUD OPERATIONS
        // ============================================

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
                    query = query.Where(p => p.UserId == userId.Value);

                if (tripId.HasValue)
                    query = query.Where(p => p.TripId == tripId.Value);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(p => p.Status == status.ToLower());

                var payments = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payments");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(long id)
        {
            try
            {
                var payment = await _context.Payments
                    .Include(p => p.User)
                    .Include(p => p.Trip)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (payment == null)
                    return NotFound(new { message = $"Payment {id} not found" });

                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payment {Id}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetPaymentHistory(long userId)
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
                _logger.LogError(ex, "Error fetching history for user {UserId}", userId);
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult> GetPaymentStats([FromQuery] long? userId = null)
        {
            try
            {
                var query = _context.Payments.AsQueryable();

                if (userId.HasValue)
                    query = query.Where(p => p.UserId == userId.Value);

                var total = await query.CountAsync();
                var completed = await query.CountAsync(p => p.Status == "completed");
                var pending = await query.CountAsync(p => p.Status == "pending");
                var failed = await query.CountAsync(p => p.Status == "failed");
                var totalAmount = await query.Where(p => p.Status == "completed").SumAsync(p => (decimal?)p.Amount) ?? 0;

                return Ok(new
                {
                    TotalPayments = total,
                    SuccessfulPayments = completed,
                    PendingPayments = pending,
                    FailedPayments = failed,
                    TotalAmount = totalAmount,
                    AverageAmount = completed > 0 ? totalAmount / completed : 0
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching stats");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Payment>> CreatePaymentDirect(Payment payment)
        {
            try
            {
                payment.CreatedAt = DateTime.UtcNow;
                payment.Status = payment.Status?.ToLower() ?? "pending";

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(long id, Payment payment)
        {
            if (id != payment.Id)
                return BadRequest(new { message = "Payment ID mismatch" });

            try
            {
                var existing = await _context.Payments.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = $"Payment {id} not found" });

                existing.Status = payment.Status?.ToLower();
                existing.Amount = payment.Amount;
                existing.Currency = payment.Currency;
                existing.TripId = payment.TripId;
                existing.ProcessedAt = payment.ProcessedAt;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment {Id}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(long id)
        {
            try
            {
                var payment = await _context.Payments.FindAsync(id);
                if (payment == null)
                    return NotFound(new { message = $"Payment {id} not found" });

                _context.Payments.Remove(payment);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting payment {Id}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        private string GenerateHmacSha1(string data, string key)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var dataBytes = Encoding.UTF8.GetBytes(data);
            
            using (var hmac = new HMACSHA1(keyBytes))
            {
                var hash = hmac.ComputeHash(dataBytes);
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
    }

    public class CreatePaymentRequest
    {
        public long UserId { get; set; }
        public long? TripId { get; set; }
        public string MerchantDomainName { get; set; } = "mistogo.ua";
        public string ProductName { get; set; } = "Оплата MistoGO";
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "UAH";
        public bool SaveCard { get; set; } = false;
        public string? ReturnUrl { get; set; }
    }

    public class PaymentCallbackRequest
    {
        public string MerchantAccount { get; set; } = string.Empty;
        public string OrderReference { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string AuthCode { get; set; } = string.Empty;
        public string CardPan { get; set; } = string.Empty;
        public string TransactionStatus { get; set; } = string.Empty;
        public string ReasonCode { get; set; } = string.Empty;
        public string RecToken { get; set; } = string.Empty;
    }
}