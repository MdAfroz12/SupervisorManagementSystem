using Microsoft.AspNetCore.Http;
using SupervisorPortal.Models.ViewModels;

namespace SupervisorPortal.Services.Interfaces
{
    public interface IFileUploadService
    {
        // Photo Upload
        Task<string> UploadPhotoAsync(IFormFile photoFile, int supervisorId);

        // Document Upload
        Task<string> UploadDocumentAsync(IFormFile documentFile, int supervisorId, string documentType);

        // Bulk Upload
        Task<List<string>> BulkUploadDocumentsAsync(List<IFormFile> files, int supervisorId);

        // Delete File
        Task<bool> DeleteFileAsync(string filePath);

        // Get File Info
        Task<long> GetFileSizeAsync(string filePath);

        // Validate File
        (bool isValid, string errorMessage) ValidateFile(IFormFile file, string[] allowedExtensions, long maxSizeInBytes);

        // Get Upload Path
        string GetUploadPath(string documentType, int supervisorId);

        // Save Document Info to Database
        Task SaveDocumentInfoAsync(int supervisorId, string documentType, string fileName, string filePath, long fileSize);
    }
}