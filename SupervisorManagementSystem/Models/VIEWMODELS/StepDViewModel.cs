using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace SupervisorPortal.Models.ViewModels
{
    public class ResearchRowViewModel
    {
        [Required(ErrorMessage = "Organization is required")]
        public string Organization { get; set; } = string.Empty;

        [Required(ErrorMessage = "Position is required")]
        public string Position { get; set; } = string.Empty;

        [Required(ErrorMessage = "From date is required")]
        [DataType(DataType.Date)]
        [Display(Name = "From")]
        public DateTime FromDate { get; set; }

        [Required(ErrorMessage = "To date is required")]
        [DataType(DataType.Date)]
        [Display(Name = "To")]
        public DateTime ToDate { get; set; }

        [Display(Name = "Duration")]
        public string Duration { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nature of research is required")]
        [Display(Name = "Nature")]
        public string NatureOfResearch { get; set; } = string.Empty;
    }

    public class StepDViewModel
    {
        // PG Approval
        [Display(Name = "PG Approved")]
        public bool IsPGApproved { get; set; }

        [Display(Name = "Letter No.")]
        public string LetterNo { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        [Display(Name = "Approval Date")]
        public DateTime? ApprovalDate { get; set; }

        [Display(Name = "University")]
        public string UniversityName { get; set; } = string.Empty;

        [Display(Name = "Other University")]
        public string OtherUniversity { get; set; } = string.Empty;

        [Display(Name = "Approval Document")]
        public IFormFile? ApprovalDocument { get; set; }

        public string ExistingApprovalDocPath { get; set; } = string.Empty;

        // Research Experience
        public List<ResearchRowViewModel> ResearchRows { get; set; } = new List<ResearchRowViewModel>();

        // Research Summary
        [Display(Name = "Papers Published")]
        public int PapersPublished { get; set; }

        [Display(Name = "Patents Filed")]
        public int PatentsFiled { get; set; }

        [Display(Name = "Patents Granted")]
        public int PatentsGranted { get; set; }

        [Display(Name = "Total Research Experience")]
        public string TotalResearchExperience { get; set; } = string.Empty;

        // Uploaded Documents
        public List<IFormFile> ResearchDocuments { get; set; } = new List<IFormFile>();
    }
}
