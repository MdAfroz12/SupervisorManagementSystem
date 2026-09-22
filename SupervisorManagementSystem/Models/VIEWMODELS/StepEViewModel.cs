using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace SupervisorPortal.Models.ViewModels
{
    public class PublicationRowViewModel
    {
        [Required(ErrorMessage = "Publication type is required")]
        [Display(Name = "Type")]
        public string PublicationType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Authors are required")]
        public string Authors { get; set; } = string.Empty;

        public string Publisher { get; set; } = string.Empty;

        [Required(ErrorMessage = "Year is required")]
        [Range(1900, 2100, ErrorMessage = "Please enter valid year")]
        public int Year { get; set; }

        [Display(Name = "ISBN/DOI")]
        public string ISBN_DOI { get; set; } = string.Empty;

        [Display(Name = "Journal/Conference")]
        public string JournalConference { get; set; } = string.Empty;

        [Display(Name = "Volume/Issue")]
        public string VolumeIssue { get; set; } = string.Empty;

        public string Indexing { get; set; } = string.Empty;

        public string Pages { get; set; } = string.Empty;

        public string Edition { get; set; } = string.Empty;

        [Display(Name = "Reference No.")]
        public string ReferenceNo { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;
    }

    public class StepEViewModel
    {
        // Books
        public List<PublicationRowViewModel> Books { get; set; } = new List<PublicationRowViewModel>();

        // Research Papers
        public List<PublicationRowViewModel> ResearchPapers { get; set; } = new List<PublicationRowViewModel>();

        // Chapters
        public List<PublicationRowViewModel> Chapters { get; set; } = new List<PublicationRowViewModel>();

        // Other Publications
        public List<PublicationRowViewModel> OtherPublications { get; set; } = new List<PublicationRowViewModel>();

        // File Uploads
        public List<IFormFile> BookDocuments { get; set; } = new List<IFormFile>();
        public IFormFile? BulkUploadFile { get; set; }   // nullable

        // Summary
        public int TotalBooks { get; set; }
        public int TotalPapers { get; set; }
        public int TotalChapters { get; set; }
        public int TotalOthers { get; set; }
        public int TotalPublications { get; set; }
    }
}
