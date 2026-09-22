using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SupervisorPortal.Models;
using SupervisorPortal.Services.Interfaces;

namespace SupervisorPortal.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly SupervisorDbContext _context;

        public FileUploadService(
            IWebHostEnvironment environment,
            IConfiguration configuration,
            SupervisorDbContext context)
        {
            _environment = environment;
            _configuration = configuration;
            _context = context;
        }

        public async Task<string> UploadPhotoAsync(IFormFile photoFile, int supervisorId)
        {
            try
            {
                // Validate file
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var maxSize = 2 * 1024 * 1024; // 2MB
                var validation = ValidateFile(photoFile, allowedExtensions, maxSize);

                if (!validation.isValid)
                    throw new Exception(validation.errorMessage);

                // Create upload path
                var uploadPath = GetUploadPath("photos", supervisorId);
                var fileName = $"photo_{supervisorId}_{DateTime.Now:yyyyMMddHHmmss}{Path.GetExtension(photoFile.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);

                // Create directory if not exists
                Directory.CreateDirectory(uploadPath);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await photoFile.CopyToAsync(stream);
                }

                // Return relative path
                return Path.Combine("uploads", "photos", supervisorId.ToString(), fileName);
            }
            catch (Exception ex)
            {
                throw new Exception($"Photo upload failed: {ex.Message}");
            }
        }

        public async Task<string> UploadDocumentAsync(IFormFile documentFile, int supervisorId, string documentType)
        {
            try
            {
                // Validate file
                var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
                var maxSize = 5 * 1024 * 1024; // 5MB
                var validation = ValidateFile(documentFile, allowedExtensions, maxSize);

                if (!validation.isValid)
                    throw new Exception(validation.errorMessage);

                // Create upload path
                var uploadPath = GetUploadPath("documents", supervisorId);
                var fileName = $"{documentType}_{supervisorId}_{DateTime.Now:yyyyMMddHHmmss}{Path.GetExtension(documentFile.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);

                // Create directory if not exists
                Directory.CreateDirectory(uploadPath);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await documentFile.CopyToAsync(stream);
                }

                // Get file size
                var fileSize = await GetFileSizeAsync(filePath);

                // Save to database
                await SaveDocumentInfoAsync(supervisorId, documentType, documentFile.FileName, filePath, fileSize);

                // Return relative path
                return Path.Combine("uploads", "documents", supervisorId.ToString(), fileName);
            }
            catch (Exception ex)
            {
                throw new Exception($"Document upload failed: {ex.Message}");
            }
        }

        public async Task<List<string>> BulkUploadDocumentsAsync(List<IFormFile> files, int supervisorId)
        {
            var uploadedPaths = new List<string>();

            foreach (var file in files)
            {
                try
                {
                    // Determine document type from filename
                    var docType = DetermineDocumentType(file.FileName);

                    if (!string.IsNullOrEmpty(docType))
                    {
                        var path = await UploadDocumentAsync(file, supervisorId, docType);
                        uploadedPaths.Add(path);
                    }
                }
                catch (Exception ex)
                {
                    // Log error but continue with other files
                    Console.WriteLine($"Error uploading {file.FileName}: {ex.Message}");
                }
            }

            return uploadedPaths;
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(_environment.WebRootPath, filePath);

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);

                    // Remove from database
                    var document = await _context.UploadedDocuments
                        .FirstOrDefaultAsync(d => d.FilePath == filePath);

                    if (document != null)
                    {
                        _context.UploadedDocuments.Remove(document);
                        await _context.SaveChangesAsync();
                    }

                    return true;
                }

                return false;
            }
            catch
            {
                return false;
            }
        }

        public async Task<long> GetFileSizeAsync(string filePath)
        {
            var fullPath = Path.Combine(_environment.WebRootPath, filePath);

            if (File.Exists(fullPath))
            {
                var fileInfo = new FileInfo(fullPath);
                return fileInfo.Length;
            }

            return 0;
        }

        public (bool isValid, string errorMessage) ValidateFile(IFormFile file, string[] allowedExtensions, long maxSizeInBytes)
        {
            // Check if file is null
            if (file == null || file.Length == 0)
                return (false, "File is empty");

            // Check file size
            if (file.Length > maxSizeInBytes)
                return (false, $"File size exceeds {maxSizeInBytes / (1024 * 1024)}MB limit");

            // Check file extension
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return (false, $"File type not allowed. Allowed types: {string.Join(", ", allowedExtensions)}");

            return (true, string.Empty);
        }

        public string GetUploadPath(string documentType, int supervisorId)
        {
            var basePath = _environment.WebRootPath;

            return documentType.ToLower() switch
            {
                "photos" => Path.Combine(basePath, "uploads", "photos", supervisorId.ToString()),
                "signatures" => Path.Combine(basePath, "uploads", "signatures", supervisorId.ToString()),
                _ => Path.Combine(basePath, "uploads", "documents", supervisorId.ToString())
            };
        }

        public async Task SaveDocumentInfoAsync(int supervisorId, string documentType, string fileName, string filePath, long fileSize)
        {
            var document = new Models.Entities.UploadedDocument
            {
                SupervisorId = supervisorId,
                DocumentType = documentType,
                DocumentName = fileName,
                FilePath = filePath,
                FileSize = fileSize,
                UploadDate = DateTime.Now,
                IsVerified = false
            };

            _context.UploadedDocuments.Add(document);
            await _context.SaveChangesAsync();
        }

        private string DetermineDocumentType(string fileName)
        {
            var lowerName = fileName.ToLower();

            if (lowerName.Contains("photo") || lowerName.Contains("passport") || lowerName.Contains("picture"))
                return "photograph";
            else if (lowerName.Contains("signature") || lowerName.Contains("sign"))
                return "signature";
            else if (lowerName.Contains("aadhar") || lowerName.Contains("uid") || lowerName.Contains("aadhaar"))
                return "aadhar";
            else if (lowerName.Contains("10th") || lowerName.Contains("ssc") || lowerName.Contains("10"))
                return "marksheet10";
            else if (lowerName.Contains("12th") || lowerName.Contains("hsc") || lowerName.Contains("12") || lowerName.Contains("intermediate"))
                return "marksheet12";
            else if (lowerName.Contains("ug") || lowerName.Contains("bachelor") || lowerName.Contains("graduation"))
                return "ugDegree";
            else if (lowerName.Contains("pg") || lowerName.Contains("master") || lowerName.Contains("postgraduate"))
                return "pgDegree";
            else if (lowerName.Contains("phd") || lowerName.Contains("doctorate"))
                return "phdCertificate";
            else if (lowerName.Contains("experience") || lowerName.Contains("work") || lowerName.Contains("employ"))
                return "experience";
            else if (lowerName.Contains("caste") || lowerName.Contains("category"))
                return "caste";
            else
                return "other";
        }
    }
}