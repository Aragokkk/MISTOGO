using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;
using BCrypt.Net;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(MistoGoContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/users
        /// Отримати список всіх користувачів з фільтрами
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(
            [FromQuery] string? role = null,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.Users.AsQueryable();

                if (!string.IsNullOrEmpty(role))
                {
                    query = query.Where(u => u.Role == role.ToLower());
                }

                if (isActive.HasValue)
                {
                    query = query.Where(u => u.IsActive == isActive.Value);
                }

                var users = await query
                    .OrderBy(u => u.Email)
                    .ToListAsync();

                // Приховуємо паролі
                foreach (var user in users)
                {
                    user.PasswordHash = null;
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching users");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/users/5
        /// Отримати деталі одного користувача за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = $"User with ID {id} not found" });
                }

                // Приховуємо пароль
                user.PasswordHash = null;

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/users/email/user@example.com
        /// Отримати користувача за email
        /// </summary>
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == email.ToLower());

                if (user == null)
                {
                    return NotFound(new { message = $"User with email {email} not found" });
                }

                // Приховуємо пароль
                user.PasswordHash = null;

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user with email {Email}", email);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// POST: api/users
        /// Створити нового користувача
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody]User user)
        {
            try
            {
                // Перевірка чи існує користувач з таким email
                if (await _context.Users.AnyAsync(u => u.Email == user.Email.ToLower()))
                {
                    return BadRequest(new { message = "User with this email already exists" });
                }

                user.Email = user.Email.ToLower();
                user.CreatedAt = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;

                // Якщо пароль не заданий - генеруємо дефолтний
                if (string.IsNullOrEmpty(user.PasswordHash))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword("DefaultPassword123!");
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} ({Email}) created successfully", user.Id, user.Email);

                // Приховуємо пароль перед поверненням
                user.PasswordHash = null;

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// PUT: api/users/5
        /// Оновити існуючого користувача
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(long id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest(new { message = "User ID mismatch" });
            }

            try
            {
                var existingUser = await _context.Users.FindAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new { message = $"User with ID {id} not found" });
                }

                // Оновлюємо тільки дозволені поля
                existingUser.FullName = user.FullName;
                existingUser.Phone = user.Phone;
                existingUser.Role = user.Role;
                existingUser.Balance = user.Balance;
                existingUser.IsActive = user.IsActive;
                existingUser.UpdatedAt = DateTime.UtcNow;

                // Email не змінюємо (або додайте перевірку на унікальність)
                // PasswordHash не змінюємо через звичайний PUT (окремий endpoint для зміни пароля)

                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} updated successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// DELETE: api/users/5
        /// Видалити користувача
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = $"User with ID {id} not found" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} deleted successfully", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// GET: api/users/stats
        /// Статистика по користувачам
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult> GetUserStats()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var activeUsers = await _context.Users.CountAsync(u => u.IsActive);
                var adminUsers = await _context.Users.CountAsync(u => u.Role == "admin");
                var totalBalance = await _context.Users.SumAsync(u => (decimal?)u.Balance) ?? 0;

                var stats = new
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    AdminUsers = adminUsers,
                    TotalBalance = totalBalance,
                    AverageBalance = totalUsers > 0 ? totalBalance / totalUsers : 0
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user stats");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}