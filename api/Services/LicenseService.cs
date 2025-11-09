using MistoGO.Data;
using MistoGO.DTOs;
using MistoGO.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace MistoGO.Services
{
    public class LicenseService : ILicenseService
    {
        private readonly MistoGoContext _context;  // ← ВИПРАВЛЕНО
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadPath;

        public LicenseService(MistoGoContext context, IWebHostEnvironment environment)  // ← ВИПРАВЛЕНО
        {
            _context = context;
            _environment = environment;
            _uploadPath = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", "licenses");
            
            // Створюємо папку, якщо не існує
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        public async Task<LicenseSubmitResponse> SubmitLicenseAsync(long userId, IFormFile file)
        {
            try
            {
                // Валідація файлу
                if (file == null || file.Length == 0)
                {
                    return new LicenseSubmitResponse
                    {
                        Success = false,
                        Message = "Файл не завантажено"
                    };
                }

                // Перевірка типу файлу
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    return new LicenseSubmitResponse
                    {
                        Success = false,
                        Message = "Дозволені тільки файли JPG, PNG та PDF"
                    };
                }

                // Перевірка розміру (5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return new LicenseSubmitResponse
                    {
                        Success = false,
                        Message = "Розмір файлу не повинен перевищувати 5MB"
                    };
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return new LicenseSubmitResponse
                    {
                        Success = false,
                        Message = "Користувача не знайдено"
                    };
                }

                // Видаляємо старий файл, якщо існує
                if (!string.IsNullOrEmpty(user.LicenseDocumentUrl))
                {
                    DeleteOldFile(user.LicenseDocumentUrl);
                }

                // Зберігаємо новий файл
                var fileName = $"license-{userId}-{DateTime.Now.Ticks}{extension}";
                var filePath = Path.Combine(_uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Оновлюємо базу даних
                user.LicenseStatus = "pending";
                user.LicenseDocumentUrl = $"/uploads/licenses/{fileName}";
                user.LicenseSubmittedAt = DateTime.UtcNow;
                user.LicenseVerifiedAt = null;
                user.LicenseRejectReason = null;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new LicenseSubmitResponse
                {
                    Success = true,
                    Message = "Водійське посвідчення відправлено на перевірку",
                    Data = new LicenseStatusDto
                    {
                        Status = user.LicenseStatus,
                        DocumentUrl = user.LicenseDocumentUrl,
                        SubmittedAt = user.LicenseSubmittedAt,
                        VerifiedAt = user.LicenseVerifiedAt,
                        RejectReason = user.LicenseRejectReason
                    }
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error submitting license: {ex.Message}");
                return new LicenseSubmitResponse
                {
                    Success = false,
                    Message = "Помилка при завантаженні документа"
                };
            }
        }

        public async Task<LicenseStatusDto> GetLicenseStatusAsync(long userId)
        {
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                return new LicenseStatusDto { Status = "none" };
            }

            return new LicenseStatusDto
            {
                Status = user.LicenseStatus ?? "none",
                DocumentUrl = user.LicenseDocumentUrl,
                SubmittedAt = user.LicenseSubmittedAt,
                VerifiedAt = user.LicenseVerifiedAt,
                RejectReason = user.LicenseRejectReason
            };
        }

        public async Task<bool> CancelSubmissionAsync(long userId)
        {
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                return false;
            }

            // Не дозволяємо видаляти перевірені документи
            if (user.LicenseStatus == "verified")
            {
                return false;
            }

            // Видаляємо файл
            if (!string.IsNullOrEmpty(user.LicenseDocumentUrl))
            {
                DeleteOldFile(user.LicenseDocumentUrl);
            }

            // Скидаємо всі поля
            user.LicenseStatus = "none";
            user.LicenseDocumentUrl = null;
            user.LicenseSubmittedAt = null;
            user.LicenseVerifiedAt = null;
            user.LicenseRejectReason = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PendingLicenseDto>> GetPendingLicensesAsync()
        {
            return await _context.Users
                .Where(u => u.LicenseStatus == "pending")
                .OrderBy(u => u.LicenseSubmittedAt)
                .Select(u => new PendingLicenseDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    LicenseDocumentUrl = u.LicenseDocumentUrl,
                    LicenseSubmittedAt = u.LicenseSubmittedAt
                })
                .ToListAsync();
        }

        public async Task<bool> VerifyLicenseAsync(long userId)
        {
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null || user.LicenseStatus != "pending")
            {
                return false;
            }

            user.LicenseStatus = "verified";
            user.LicenseVerifiedAt = DateTime.UtcNow;
            user.LicenseRejectReason = null;
            user.LicenseVerified = true; // Оновлюємо старе поле для сумісності
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectLicenseAsync(long userId, string reason)
        {
            if (string.IsNullOrEmpty(reason))
            {
                return false;
            }

            var user = await _context.Users.FindAsync(userId);
            
            if (user == null || user.LicenseStatus != "pending")
            {
                return false;
            }

            user.LicenseStatus = "rejected";
            user.LicenseVerifiedAt = null;
            user.LicenseRejectReason = reason;
            user.LicenseVerified = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        private void DeleteOldFile(string documentUrl)
        {
            try
            {
                var fileName = Path.GetFileName(documentUrl);
                var filePath = Path.Combine(_uploadPath, fileName);
                
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting file: {ex.Message}");
            }
        }
    }
}