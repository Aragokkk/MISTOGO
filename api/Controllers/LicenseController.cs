using Microsoft.AspNetCore.Mvc;
using MistoGO.Services;
using MistoGO.DTOs;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LicenseController : ControllerBase
    {
        private readonly ILicenseService _licenseService;
        private readonly ILogger<LicenseController> _logger;

        public LicenseController(ILicenseService licenseService, ILogger<LicenseController> logger)
        {
            _licenseService = licenseService;
            _logger = logger;
        }

        // GET: api/license/status?userId=123
        [HttpGet("status")]
        public async Task<ActionResult<ApiResponse<LicenseStatusDto>>> GetLicenseStatus([FromQuery] long userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest(new ApiResponse<LicenseStatusDto>
                    {
                        Success = false,
                        Message = "Невірний ID користувача"
                    });
                }

                var status = await _licenseService.GetLicenseStatusAsync(userId);
                
                return Ok(new ApiResponse<LicenseStatusDto>
                {
                    Success = true,
                    Message = "Статус отримано",
                    Data = status
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting license status");
                return StatusCode(500, new ApiResponse<LicenseStatusDto>
                {
                    Success = false,
                    Message = "Помилка при отриманні статусу"
                });
            }
        }

        // POST: api/license/submit
        [HttpPost("submit")]
        [Consumes("multipart/form-data")]
        [ApiExplorerSettings(IgnoreApi = true)]  // ← ПРИХОВУЄМО ЗІ SWAGGER
        public async Task<ActionResult<LicenseSubmitResponse>> SubmitLicense([FromForm] IFormFile file, [FromForm] long userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest(new LicenseSubmitResponse
                    {
                        Success = false,
                        Message = "Невірний ID користувача"
                    });
                }

                if (file == null)
                {
                    return BadRequest(new LicenseSubmitResponse
                    {
                        Success = false,
                        Message = "Файл не надано"
                    });
                }

                var result = await _licenseService.SubmitLicenseAsync(userId, file);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting license");
                return StatusCode(500, new LicenseSubmitResponse
                {
                    Success = false,
                    Message = "Помилка при відправці документа"
                });
            }
        }

        // DELETE: api/license/cancel?userId=123
        [HttpDelete("cancel")]
        public async Task<ActionResult<ApiResponse<object>>> CancelSubmission([FromQuery] long userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Невірний ID користувача"
                    });
                }

                var result = await _licenseService.CancelSubmissionAsync(userId);
                
                if (!result)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Не вдалося скасувати відправлення"
                    });
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Документ успішно видалено"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error canceling submission");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Помилка при скасуванні"
                });
            }
        }

        // ========== АДМІН ЕНДПОІНТИ ==========

        // GET: api/license/pending
        [HttpGet("pending")]
        public async Task<ActionResult<ApiResponse<List<PendingLicenseDto>>>> GetPendingLicenses()
        {
            try
            {
                var licenses = await _licenseService.GetPendingLicensesAsync();
                
                return Ok(new ApiResponse<List<PendingLicenseDto>>
                {
                    Success = true,
                    Message = "Список отримано",
                    Data = licenses
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pending licenses");
                return StatusCode(500, new ApiResponse<List<PendingLicenseDto>>
                {
                    Success = false,
                    Message = "Помилка при отриманні списку"
                });
            }
        }

        // POST: api/license/verify/123
        [HttpPost("verify/{userId}")]
        public async Task<ActionResult<ApiResponse<object>>> VerifyLicense(long userId)
        {
            try
            {
                var result = await _licenseService.VerifyLicenseAsync(userId);
                
                if (!result)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Не вдалося підтвердити документ"
                    });
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Водійське посвідчення підтверджено"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying license");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Помилка при підтвердженні"
                });
            }
        }

        // POST: api/license/reject/123
        [HttpPost("reject/{userId}")]
        public async Task<ActionResult<ApiResponse<object>>> RejectLicense(long userId, [FromBody] LicenseRejectRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Reason))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Вкажіть причину відхилення"
                    });
                }

                var result = await _licenseService.RejectLicenseAsync(userId, request.Reason);
                
                if (!result)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Не вдалося відхилити документ"
                    });
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Водійське посвідчення відхилено"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting license");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Помилка при відхиленні"
                });
            }
        }
    }
}