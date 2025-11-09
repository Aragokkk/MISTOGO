using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
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

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                var merchantDomainName = "mistogo.online";
                var orderDateSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                var orderReference = $"ORDER_{orderDateSeconds}_{request.UserId}";

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
                _logger.LogInformation("💾 Payment created: ID={PaymentId}", payment.Id);

                var productNameArray = new[] { request.ProductName };
                var productCountArray = new[] { 1 };
                var productPriceArray = new[] { request.Amount };

                // ✅ Якщо SaveCard = true, генеруємо підпис для VERIFY режиму
                string merchantSignature;
                string baseString; // ✅ Оголошуємо тут, щоб використати для логування
                
                if (request.SaveCard)
                {
                    baseString = BuildVerifySignatureBase(
                        MERCHANT_ACCOUNT,
                        merchantDomainName,
                        orderReference,
                        orderDateSeconds,
                        request.Amount,
                        request.Currency,
                        productNameArray,
                        productCountArray,
                        productPriceArray,
                        MERCHANT_SECRET_KEY
                    );
                    merchantSignature = Md5HexLower(baseString);
                    _logger.LogInformation("🔐 VERIFY baseString: {Base}", baseString);
                }
                else
                {
                    baseString = BuildSignatureBase(
                        MERCHANT_ACCOUNT,
                        merchantDomainName,
                        orderReference,
                        orderDateSeconds,
                        request.Amount,
                        request.Currency,
                        productNameArray,
                        productCountArray,
                        productPriceArray,
                        MERCHANT_SECRET_KEY
                    );
                    merchantSignature = Md5HexLower(baseString);
                    _logger.LogInformation("🔐 PAYMENT baseString: {Base}", baseString);
                }

                var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "https://mistogo.online";
                var backendUrl = _configuration["AppSettings:BackendUrl"] ?? "https://api.mistogo.online";

                // ✅ Формуємо відповідь
                var response = new
                {
                    merchantAccount = MERCHANT_ACCOUNT,
                    merchantDomainName,
                    orderReference,
                    orderDate = orderDateSeconds.ToString(),
                    amount = request.Amount.ToString("0.##", CultureInfo.InvariantCulture),
                    currency = request.Currency,
                    productName = new[] { request.ProductName },
                    productCount = new[] { "1" },
                    productPrice = new[] { request.Amount.ToString("0.##", CultureInfo.InvariantCulture) },
                    merchantSignature,
                    
                    // ✅ Додаємо requestType тільки якщо SaveCard = true
                    requestType = request.SaveCard ? "VERIFY" : (string?)null,
                    
                    returnUrl = request.ReturnUrl ?? $"{frontendUrl}/payment/success",
                    serviceUrl = $"{backendUrl}/api/Payment/callback",
                    paymentId = payment.Id,
                    language = "UA",
                    clientFirstName = "Vlad",
                    clientLastName = "Test",
                    clientPhone = "380630000000"
                };

                _logger.LogInformation("🔍 WFP signature: {Sig} (length={Len})", merchantSignature, merchantSignature.Length);
Console.WriteLine("=".PadLeft(50, '='));
Console.WriteLine($"🔐 Signature: {merchantSignature}");
Console.WriteLine($"🔐 BaseString: {baseString}");
Console.WriteLine("=".PadLeft(50, '='));
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
                _logger.LogInformation("💳 Callback: {Ref} - {Status}", callback.OrderReference, callback.TransactionStatus);

                var orderParts = callback.OrderReference.Split('_');
                if (orderParts.Length >= 3 && long.TryParse(orderParts[2], out var userId))
                {
                    var payment = await _context.Payments
                        .Where(p => p.UserId == userId && p.Status == "pending")
                        .OrderByDescending(p => p.CreatedAt)
                        .FirstOrDefaultAsync();

                    if (payment != null)
                    {
                        payment.Status = callback.TransactionStatus.Equals("approved", StringComparison.OrdinalIgnoreCase)
                            ? "completed"
                            : "failed";
                        payment.ProcessedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();

                        _logger.LogInformation("✅ Payment {Id} updated: {Status}", payment.Id, payment.Status);

                        // ✅ Якщо є recToken - зберігаємо його (для майбутніх платежів)
                        if (!string.IsNullOrEmpty(callback.RecToken))
                        {
                            _logger.LogInformation("💳 RecToken received: {Token}", callback.RecToken);
                            // Тут можна зберегти токен в базі для користувача
                        }
                    }
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
        // 📊 CRUD OPERATIONS (без змін)
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

                if (userId.HasValue) query = query.Where(p => p.UserId == userId.Value);
                if (tripId.HasValue) query = query.Where(p => p.TripId == tripId.Value);
                if (!string.IsNullOrWhiteSpace(status)) query = query.Where(p => p.Status == status.ToLower());

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
                if (userId.HasValue) query = query.Where(p => p.UserId == userId.Value);

                var total = await query.CountAsync();
                var completed = await query.CountAsync(p => p.Status == "completed");
                var pending = await query.CountAsync(p => p.Status == "pending");
                var failed = await query.CountAsync(p => p.Status == "failed");
                var totalAmount = await query
                    .Where(p => p.Status == "completed")
                    .SumAsync(p => (decimal?)p.Amount) ?? 0;

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

        // ============ Helpers для WayForPay ============

        /// <summary>
        /// Підпис для звичайного платежу (без requestType)
        /// </summary>
        private static string BuildSignatureBase(
            string merchantAccount,
            string merchantDomainName,
            string orderReference,
            long orderDateSeconds,
            decimal amount,
            string currency,
            string[] productName,
            int[] productCount,
            decimal[] productPrice,
            string merchantSecretKey)
        {
            var inv = CultureInfo.InvariantCulture;

            var parts = new List<string>
            {
                merchantAccount,
                merchantDomainName,
                orderReference,
                orderDateSeconds.ToString(inv),
                amount.ToString("0.##", inv),
                currency
            };

            parts.AddRange(productName);
            foreach (var c in productCount) parts.Add(c.ToString(inv));
            foreach (var p in productPrice) parts.Add(p.ToString("0.##", inv));
            parts.Add(merchantSecretKey);

            return string.Join(";", parts);
        }

        /// <summary>
        /// Підпис для VERIFY режиму (верифікація картки)
        /// ВАЖЛИВО: requestType НЕ входить у підпис, але передається у payload!
        /// Формула: merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;productName;productCount;productPrice;merchantSecretKey
        /// </summary>
        private static string BuildVerifySignatureBase(
            string merchantAccount,
            string merchantDomainName,
            string orderReference,
            long orderDateSeconds,
            decimal amount,
            string currency,
            string[] productName,
            int[] productCount,
            decimal[] productPrice,
            string merchantSecretKey)
        {
            var inv = CultureInfo.InvariantCulture;

            var parts = new List<string>
            {
                merchantAccount,
                merchantDomainName,
                orderReference,
                orderDateSeconds.ToString(inv),
                amount.ToString("0.##", inv),
                currency
            };

            parts.AddRange(productName);
            foreach (var c in productCount) parts.Add(c.ToString(inv));
            foreach (var p in productPrice) parts.Add(p.ToString("0.##", inv));
            
            // ✅ НЕ додаємо requestType до підпису!
            // parts.Add("VERIFY");  // <-- Видалено!
            
            parts.Add(merchantSecretKey);

            return string.Join(";", parts);
        }

        private static string Md5HexLower(string text)
        {
            using var md5 = MD5.Create();
            var bytes = Encoding.UTF8.GetBytes(text);
            var hash = md5.ComputeHash(bytes);
            var sb = new StringBuilder(hash.Length * 2);
            foreach (var b in hash) sb.Append(b.ToString("x2"));
            return sb.ToString();
        }
    }

    public class CreatePaymentRequest
    {
        public long UserId { get; set; }
        public long? TripId { get; set; }
        public string MerchantDomainName { get; set; } = "mistogo.online";
        public string ProductName { get; set; } = "Card verification";  // ✅ Латиниця!
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