namespace MistoGO.DTOs
{
    public class LicenseStatusDto
    {
        public string Status { get; set; } = "none";
        public string? DocumentUrl { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public string? RejectReason { get; set; }
    }

    public class LicenseSubmitResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public LicenseStatusDto? Data { get; set; }
    }

    public class LicenseRejectRequest
    {
        public string Reason { get; set; } = string.Empty;
    }

    public class PendingLicenseDto
    {
        public long Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? LicenseDocumentUrl { get; set; }
        public DateTime? LicenseSubmittedAt { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }
}