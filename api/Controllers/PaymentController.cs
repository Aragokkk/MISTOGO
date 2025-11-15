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

        // ✅ Тестові реквізити WayForPay
        private const string MERCHANT_ACCOUNT = "test_merch_n1";
        private const string MERCHANT_SECRET_KEY = "flk3409refn54t54t*FNJRET";

        public PaymentController(MistoGoContext context, ILogger<PaymentController> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        // ============================================
        // 🎯 Створення інвойсу (платіж / VERIFY)
        // ============================================
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                // Домен мерчанта (публічний)
                var merchantDomainName = "www.market.ua";

                // orderDate — UNIX seconds (long, число)
                var orderDateSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

                // orderReference — унікальний
                var orderReference = $"ORDER_{orderDateSeconds}_{request.UserId}";

                // Зберігаємо запис у нашій БД
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

                // Для підпису — працюємо з decimal/int масивами
                var productName = new[] { request.ProductName };
                var productCount = new[] { 1 };
                var productPrice = new[] { request.Amount };

                // ВАЖЛИВО: формуємо підпис за правильною формулою WayForPay
                // Порядок: productName[] → productCount[] → productPrice[]
                string baseString = BuildSignatureBase(
                    MERCHANT_ACCOUNT,
                    merchantDomainName,
                    orderReference,
                    orderDateSeconds,
                    request.Amount,
                    request.Currency,
                    productName,
                    productCount,
                    productPrice,
                    MERCHANT_SECRET_KEY
                );

                var merchantSignature = Md5HexLower(baseString);

                // Тестова перевірка з правильним порядком
                var testBase = "test_merch_n1;www.market.ua;DH1762697005;1415379863;1547.36;UAH;Процесор Intel Core i5-4670 3.4GHz;Kingston DDR3-1600 4096MB PC3-12800;1;1;1000;547.36;flk3409refn54t54t*FNJRET";
                var testSig = Md5HexLower(testBase);
                _logger.LogInformation("🧪 Test signature (with correct order): {Test}", testSig);

                // Публічні URL-и
                var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "https://mistogo.online";
                var backendUrl = _configuration["AppSettings:BackendUrl"] ?? "https://api.mistogo.online";

                // У відповіді уніфікуємо формат: amount / productPrice як "0.00", orderDate — число
                var inv = CultureInfo.InvariantCulture;
                var amountStr = request.Amount.ToString("0.00", inv);

                _logger.LogInformation("🔐 WFP signature: {Sig} (len={Len})", merchantSignature, merchantSignature.Length);
                _logger.LogInformation("🔐 BaseString: {Base}", baseString);

                var response = new
                {
                    merchantAccount = MERCHANT_ACCOUNT,
                    merchantDomainName,
                    authorizationType = "SimpleSignature",  // ← ДОДАЙ ЦЕ
                    orderReference,
                    orderDate = orderDateSeconds,                         // ← число
                    amount = amountStr,                                   // ← "1.00"
                    currency = request.Currency,
                    productName = new[] { request.ProductName },
                    productCount = new[] { "1" },                         // ← як рядок
                    productPrice = new[] { amountStr },                   // ← "1.00"
                    merchantSignature,

                    // requestType передаємо ТІЛЬКИ у payload, у підпис не входить
                    requestType = request.SaveCard ? "VERIFY" : null,

                    returnUrl = request.ReturnUrl ?? $"{frontendUrl}/payment/success",
                    serviceUrl = $"{backendUrl}/api/Payment/callback",
                    paymentId = payment.Id,

                    // Додаткові поля
                    language = "UA",
                    clientFirstName = "Vlad",
                    clientLastName = "Test",
                    clientPhone = "380630000000"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating payment");
                return BadRequest(new { error = ex.Message });
            }
        }

        // ============================================
        // 🔁 Callback від WayForPay
        // ============================================
        [HttpPost("callback")]
        public async Task<IActionResult> PaymentCallback([FromBody] PaymentCallbackRequest callback)
        {
            try
            {
                _logger.LogInformation("💳 Callback: {Ref} - {Status}", callback.OrderReference, callback.TransactionStatus);

                // Витягуємо userId з нашого orderReference: ORDER_{ts}_{userId}
                var orderParts = callback.OrderReference?.Split('_') ?? Array.Empty<string>();
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

                        if (!string.IsNullOrWhiteSpace(callback.RecToken))
                        {
                            _logger.LogInformation("💳 RecToken received: {Token}", callback.RecToken);
                            // TODO: Зберегти токен до профілю користувача (для майбутніх списань)
                        }
                    }
                }

                // WayForPay очікує { status: "accept" }
                return Ok(new { orderReference = callback.OrderReference, status = "accept" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Callback error");
                return BadRequest(new { error = ex.Message });
            }
        }

        // ============================================
        // 📊 CRUD / Stats
        // ============================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments(
            [FromQuery] long? userId = null,
            [FromQuery] long? tripId = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var q = _context.Payments.AsQueryable();
                if (userId.HasValue) q = q.Where(p => p.UserId == userId.Value);
                if (tripId.HasValue) q = q.Where(p => p.TripId == tripId.Value);
                if (!string.IsNullOrWhiteSpace(status)) q = q.Where(p => p.Status == status.ToLower());

                var list = await q.OrderByDescending(p => p.CreatedAt).ToListAsync();
                return Ok(list);
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

                if (payment == null) return NotFound(new { message = $"Payment {id} not found" });
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
                var q = _context.Payments.AsQueryable();
                if (userId.HasValue) q = q.Where(p => p.UserId == userId.Value);

                var total = await q.CountAsync();
                var completed = await q.CountAsync(p => p.Status == "completed");
                var pending = await q.CountAsync(p => p.Status == "pending");
                var failed = await q.CountAsync(p => p.Status == "failed");
                var totalAmount = await q.Where(p => p.Status == "completed").SumAsync(p => (decimal?)p.Amount) ?? 0;

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
        /// Формуємо базову строку підпису за формулою WayForPay (з документації):
        /// merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;
        /// productName[0];productName[1]...productName[n];
        /// productCount[0];productCount[1]...productCount[n];
        /// productPrice[0];productPrice[1]...productPrice[n];
        /// merchantSecretKey
        /// 
        /// КРИТИЧНО ВАЖЛИВО: порядок productName[] → productCount[] → productPrice[]
        /// (НЕ productName[] → productPrice[] → productCount[]!)
        /// 
        /// УВАГА: amount та productPrice обов'язково у форматі "0.00"
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
                amount.ToString("0.00", inv),
                currency
            };

            // 1. Додаємо всі productName[]
            parts.AddRange(productName);

            // 2. Додаємо всі productCount[] (згідно документації WayForPay)
            foreach (var c in productCount)
                parts.Add(c.ToString(inv));

            // 3. Додаємо всі productPrice[]
            foreach (var p in productPrice)
                parts.Add(p.ToString("0.00", inv));

            // 4. Додаємо секретний ключ
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

    // ===== DTOs =====

    public class CreatePaymentRequest
    {
        public long UserId { get; set; }
        public long? TripId { get; set; }
        public string MerchantDomainName { get; set; } = "mistogo.online";
        public string ProductName { get; set; } = "Card verification"; // латиниця
        public decimal Amount { get; set; } = 1.00m;
        public string Currency { get; set; } = "UAH";
        public bool SaveCard { get; set; } = true;
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