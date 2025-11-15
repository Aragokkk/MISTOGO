using Microsoft.AspNetCore.Mvc;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IWebHostEnvironment env, ILogger<UploadController> logger)
        {
            _env = env;
            _logger = logger;
        }

        [HttpPost]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { message = "Файл не отримано" });

                var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                if (!Directory.Exists(webRoot)) Directory.CreateDirectory(webRoot);

                var uploadPath = Path.Combine(webRoot, "uploads");
                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

                var ext = Path.GetExtension(file.FileName);
                var fileName = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{Guid.NewGuid():N}{ext}";
                var filePath = Path.Combine(uploadPath, fileName);

                await using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativePath = $"/uploads/{fileName}";
                var absoluteUrl = $"{Request.Scheme}://{Request.Host}{relativePath}";

                _logger.LogInformation("File uploaded: {Path}", relativePath);

                return Ok(new { url = absoluteUrl, path = relativePath });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, new { message = "Помилка завантаження файлу" });
            }
        }
    }
}
