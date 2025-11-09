using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/password_resets")]  // ← Точна назва з підкресленням як в БД
    public class PasswordResetsController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<PasswordResetsController> _logger;

        public PasswordResetsController(MistoGoContext context, ILogger<PasswordResetsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/passwordresets
        /// Отримати список всіх запитів на відновлення пароля
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PasswordReset>>> GetPasswordResets(
            [FromQuery] long? userId = null,
            [FromQuery] bool? used = null)
        {
            try
            {
                var query = _context.PasswordResets.AsQueryable();

                if (userId.HasValue)
                {
                    query = query.Where(pr => pr.UserId == userId.Value);
                }

                if (used.HasValue)
                {
                    query = query.Where(pr => pr.Used == used.Value);
                }

                var passwordResets = await query
                    .OrderByDescending(pr => pr.CreatedAt)
                    .ToListAsync();

                return Ok(passwordResets);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching password resets");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/passwordresets/5
        /// Отримати деталі одного запиту за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PasswordReset>> GetPasswordReset(long id)
        {
            try
            {
                var passwordReset = await _context.PasswordResets.FindAsync(id);

                if (passwordReset == null)
                {
                    return NotFound(new { message = $"Password reset with ID {id} not found" });
                }

                return Ok(passwordReset);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching password reset {PasswordResetId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/passwordresets/token/{token}
        /// Перевірити токен відновлення
        /// </summary>
        [HttpGet("token/{token}")]
        public async Task<ActionResult> ValidateToken(string token)
        {
            try
            {
                var passwordReset = await _context.PasswordResets
                    .FirstOrDefaultAsync(pr => pr.Token == token && !pr.Used);

                if (passwordReset == null)
                {
                    return NotFound(new { 
                        valid = false,
                        message = "Invalid or already used token" 
                    });
                }

                // Перевірка чи не протермінувався токен
                if (passwordReset.ExpiresAt < DateTime.UtcNow)
                {
                    return BadRequest(new { 
                        valid = false,
                        message = "Token has expired" 
                    });
                }

                return Ok(new { 
                    valid = true,
                    userId = passwordReset.UserId,
                    message = "Token is valid" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// POST: api/passwordresets
        /// Створити новий запит на відновлення пароля
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PasswordReset>> CreatePasswordReset(PasswordReset passwordReset)
        {
            try
            {
                passwordReset.CreatedAt = DateTime.UtcNow;
                passwordReset.Used = false;

                // Генеруємо токен якщо не вказаний
                if (string.IsNullOrEmpty(passwordReset.Token))
                {
                    passwordReset.Token = Guid.NewGuid().ToString("N");
                }

                // Встановлюємо термін дії (24 години) якщо не вказаний
                if (passwordReset.ExpiresAt == DateTime.MinValue)
                {
                    passwordReset.ExpiresAt = DateTime.UtcNow.AddHours(24);
                }

                _context.PasswordResets.Add(passwordReset);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Password reset {PasswordResetId} created for user {UserId}", 
                    passwordReset.Id, passwordReset.UserId);

                return CreatedAtAction(nameof(GetPasswordReset), new { id = passwordReset.Id }, passwordReset);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating password reset");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// PUT: api/passwordresets/use/{token}
        /// Позначити токен як використаний
        /// </summary>
        [HttpPut("use/{token}")]
        public async Task<IActionResult> UseToken(string token)
        {
            try
            {
                var passwordReset = await _context.PasswordResets
                    .FirstOrDefaultAsync(pr => pr.Token == token);

                if (passwordReset == null)
                {
                    return NotFound(new { message = "Token not found" });
                }

                if (passwordReset.Used)
                {
                    return BadRequest(new { message = "Token already used" });
                }

                if (passwordReset.ExpiresAt < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Token has expired" });
                }

                passwordReset.Used = true;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Password reset token {Token} marked as used", token);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error using password reset token");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// DELETE: api/passwordresets/5
        /// Видалити запит на відновлення
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePasswordReset(long id)
        {
            try
            {
                var passwordReset = await _context.PasswordResets.FindAsync(id);
                if (passwordReset == null)
                {
                    return NotFound(new { message = $"Password reset with ID {id} not found" });
                }

                _context.PasswordResets.Remove(passwordReset);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Password reset {PasswordResetId} deleted successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting password reset {PasswordResetId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// DELETE: api/passwordresets/cleanup
        /// Очистити протерміновані та використані токени
        /// </summary>
        [HttpDelete("cleanup")]
        public async Task<ActionResult> CleanupExpiredTokens()
        {
            try
            {
                var expiredTokens = await _context.PasswordResets
                    .Where(pr => pr.ExpiresAt < DateTime.UtcNow || pr.Used)
                    .ToListAsync();

                _context.PasswordResets.RemoveRange(expiredTokens);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Cleaned up {Count} expired/used password reset tokens", expiredTokens.Count);

                return Ok(new { 
                    message = "Cleanup completed successfully",
                    deletedCount = expiredTokens.Count 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up expired tokens");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}