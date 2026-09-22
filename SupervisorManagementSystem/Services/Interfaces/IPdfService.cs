using SupervisorPortal.Models.Entities;

namespace SupervisorPortal.Services.Interfaces
{
    public interface IPdfService
    {
        // Generate Application PDF
        Task<byte[]> GenerateApplicationPdfAsync(int supervisorId, string applicationNumber);

        // Generate Summary PDF
        Task<byte[]> GenerateSummaryPdfAsync(int supervisorId);

        // Generate Experience Certificate
        Task<byte[]> GenerateExperienceCertificateAsync(int employmentId);

        // Merge PDFs
        Task<byte[]> MergePdfsAsync(List<byte[]> pdfFiles);

        // Add Watermark
        Task<byte[]> AddWatermarkAsync(byte[] pdfBytes, string watermarkText);

        // Generate Application Number
        string GenerateApplicationNumber(int supervisorId);
    }
}