using MistoGO.DTOs;
using Microsoft.AspNetCore.Http;

namespace MistoGO.Services
{
    public interface ILicenseService
    {
        Task<LicenseSubmitResponse> SubmitLicenseAsync(long userId, IFormFile file);
        Task<LicenseStatusDto> GetLicenseStatusAsync(long userId);
        Task<bool> CancelSubmissionAsync(long userId);
        Task<List<PendingLicenseDto>> GetPendingLicensesAsync();
        Task<bool> VerifyLicenseAsync(long userId);
        Task<bool> RejectLicenseAsync(long userId, string reason);
    }
}