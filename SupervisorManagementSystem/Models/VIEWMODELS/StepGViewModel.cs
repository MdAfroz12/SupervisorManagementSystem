using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace SupervisorPortal.Models.ViewModels
{
    public class DocumentViewModel
    {
        [Required(ErrorMessage = "Document type is required")]
        public string DocumentType { get; set; } = string.Empty;

        [Display(Name = "Document")]
        public IFormFile? DocumentFile { get; set; }  // Nullable, kyunki upload optional ho sakta hai

        public string ExistingFilePath { get; set; } = string.Empty;
        public bool IsUploaded { get; set; } = false;
        public string FileName { get; set; } = string.Empty;
        public bool IsRequired { get; set; } = false;
    }

    public class StepGViewModel
    {
        // Documents List
        public List<DocumentViewModel> Documents { get; set; } = new List<DocumentViewModel>();

        // Bulk Upload
        public List<IFormFile> BulkUploadFiles { get; set; } = new List<IFormFile>();

        // Declaration
        [Required(ErrorMessage = "You must agree to the declaration")]
        [Display(Name = "I agree to the declaration")]
        public bool AgreeDeclaration { get; set; } = false;

        [Required(ErrorMessage = "Digital signature is required")]
        [StringLength(500)]
        [Display(Name = "Digital Signature")]
        public string DigitalSignature { get; set; } = string.Empty;

        [Required(ErrorMessage = "Declaration date is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Date")]
        public DateTime DeclarationDate { get; set; } = DateTime.Today;

        // Summary
        public string ApplicantName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ApplicationDate { get; set; } = string.Empty;
        public string DocumentsSummary { get; set; } = string.Empty;

        // Progress
        public int TotalDocs { get; set; } = 0;
        public int UploadedDocs { get; set; } = 0;
        public int PendingDocs { get; set; } = 0;
        public int MandatoryDocs { get; set; } = 0;
        public int ProgressPercentage { get; set; } = 0;
    }
}
