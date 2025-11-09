using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MistoGO.Data;
using MistoGO.Models;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {
        private readonly MistoGoContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProfileController(MistoGoContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // ======= ЗАВАНТАЖЕННЯ ФОТО ПРОФІЛЮ =======
        [HttpPost("upload-photo")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadPhoto([FromForm] long userId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Файл не вибрано" });

            // Валідація розміру (5MB)
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { success = false, message = "Розмір файлу не повинен перевищувати 5MB" });

            // Валідація типу
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest(new { success = false, message = "Дозволені тільки файли JPG та PNG" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "Користувача не знайдено" });

            try
            {
                // Створюємо папку для фото профілів якщо не існує
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "profiles");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Видаляємо старе фото якщо існує
                if (!string.IsNullOrEmpty(user.ProfilePhotoUrl))
                {
                    var oldPhotoPath = Path.Combine(_environment.WebRootPath, user.ProfilePhotoUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPhotoPath))
                        System.IO.File.Delete(oldPhotoPath);
                }

                // Генеруємо унікальну назву файлу
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"user_{userId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Зберігаємо файл
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Оновлюємо URL в базі даних
                user.ProfilePhotoUrl = $"/uploads/profiles/{fileName}";
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Фото успішно завантажено",
                    photoUrl = user.ProfilePhotoUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Помилка при завантаженні: {ex.Message}" });
            }
        }

        // ======= ВИДАЛЕННЯ ФОТО ПРОФІЛЮ =======
        [HttpDelete("delete-photo/{userId}")]
        public async Task<IActionResult> DeletePhoto(long userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "Користувача не знайдено" });

            if (string.IsNullOrEmpty(user.ProfilePhotoUrl))
                return BadRequest(new { success = false, message = "У користувача немає фото профілю" });

            try
            {
                // Видаляємо файл
                var photoPath = Path.Combine(_environment.WebRootPath, user.ProfilePhotoUrl.TrimStart('/'));
                if (System.IO.File.Exists(photoPath))
                    System.IO.File.Delete(photoPath);

                // Оновлюємо базу даних
                user.ProfilePhotoUrl = null;
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Фото успішно видалено" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Помилка при видаленні: {ex.Message}" });
            }
        }

        // ======= ОТРИМАННЯ ДАНИХ ПРОФІЛЮ =======
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(long userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "Користувача не знайдено" });

            return Ok(new
            {
                success = true,
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
                    profilePhotoUrl = user.ProfilePhotoUrl
                }
            });
        }
    }
}