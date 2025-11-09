using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly MistoGoContext _context;

        public AuthController(MistoGoContext context)
        {
            _context = context;
        }

        // ======= РЕЄСТРАЦІЯ =======
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { success = false, message = "Email та пароль обов'язкові" });

            if (request.Password.Length < 6)
                return BadRequest(new { success = false, message = "Пароль має бути мінімум 6 символів" });

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

            if (existingUser != null)
                return BadRequest(new { success = false, message = "Email вже використовується" });

            var user = new User
            {
                Email = request.Email.ToLower(),
                PasswordHash = HashPassword(request.Password),
                FullName = request.FullName ?? "",
                Phone = request.Phone ?? "",
                Balance = 0,
                Role = "user",
                IsActive = true,
                IsBlocked = false,
                PhoneVerified = false,
                LicenseVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Реєстрація успішна! Тепер можете увійти.",
                userId = user.Id,
                email = user.Email
            });
        }

        // ======= ВХІД =======
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { success = false, message = "Email та пароль обов'язкові" });

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

            if (user == null || user.PasswordHash != HashPassword(request.Password))
                return Unauthorized(new { success = false, message = "Невірний email або пароль" });

            if (user.IsBlocked)
                return BadRequest(new { success = false, message = "Ваш аккаунт заблоковано" });

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Вхід успішний",
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    fullName = user.FullName,
                    phone = user.Phone,
                    balance = user.Balance,
                    role = user.Role,
                    phoneVerified = user.PhoneVerified,
                    licenseVerified = user.LicenseVerified,
                    profilePhotoUrl = user.ProfilePhotoUrl  // ← ДОДАНО ЦЕ ПОЛЕ
                }
            });
        }

        // ======= ЗАПИТ НА ВІДНОВЛЕННЯ ПАРОЛЮ =======
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { success = false, message = "Email обов'язковий" });

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

            // Не розкриваємо існування email
            if (user == null)
                return Ok(new { success = true, message = "Якщо email існує, ми надіслали код для відновлення" });

            var resetCode = new Random().Next(100000, 999999).ToString();

            var passwordReset = new PasswordReset
            {
                UserId = user.Id,
                Token = resetCode,
                ExpiresAt = DateTime.UtcNow.AddMinutes(30),
                Used = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.PasswordResets.Add(passwordReset);
            await _context.SaveChangesAsync();

            // TODO: Відправка листа. Поки повертаємо код для тесту
            return Ok(new { success = true, message = "Код відновлення надіслано", testCode = resetCode });
        }

        // ======= СКИДАННЯ ПАРОЛЮ =======
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) ||
                string.IsNullOrEmpty(request.Code) ||
                string.IsNullOrEmpty(request.NewPassword))
                return BadRequest(new { success = false, message = "Всі поля обов'язкові" });

            if (request.NewPassword.Length < 6)
                return BadRequest(new { success = false, message = "Пароль має бути мінімум 6 символів" });

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

            if (user == null)
                return BadRequest(new { success = false, message = "Невірні дані" });

            var passwordReset = await _context.PasswordResets
                .Where(pr => pr.UserId == user.Id &&
                             pr.Token == request.Code &&
                             !pr.Used &&
                             pr.ExpiresAt > DateTime.UtcNow)
                .FirstOrDefaultAsync();

            if (passwordReset == null)
                return BadRequest(new { success = false, message = "Невірний або прострочений код" });

            user.PasswordHash = HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            passwordReset.Used = true;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Пароль успішно змінено! Тепер можете увійти." });
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "mistogo_2024"));
            return Convert.ToBase64String(bytes);
        }
    }

    // DTOs
    public class RegisterRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? FullName { get; set; }
        public string? Phone { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = "";
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; } = "";
        public string Code { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
}