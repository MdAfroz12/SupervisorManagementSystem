using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace SupervisorPortal.Models.ViewModels
{
    public class ProfessionalExperienceViewModel
    {
        [Required(ErrorMessage = "Institution name is required")]
        [Display(Name = "Institution")]
        public string InstitutionName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Post held is required")]
        [Display(Name = "Post")]
        public string PostHeld { get; set; } = string.Empty;

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

        [Display(Name = "Admin Experience (Years)")]
        public decimal AdminExperienceYears { get; set; }

        [Display(Name = "Nature of Work")]
        public string NatureOfWork { get; set; } = string.Empty;

        public string Remarks { get; set; } = string.Empty;
    }

    public class AwardViewModel
    {
        [Required(ErrorMessage = "Award name is required")]
        [Display(Name = "Award")]
        public string AwardName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Organization is required")]
        [Display(Name = "Organization")]
        public string Organization { get; set; } = string.Empty;

        [Required(ErrorMessage = "Year is required")]
        [Range(1900, 2100)]
        public int Year { get; set; }

        public string Level { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class MembershipViewModel
    {
        [Required(ErrorMessage = "Organization is required")]
        public string Organization { get; set; } = string.Empty;

        [Display(Name = "Type")]
        public string MembershipType { get; set; } = string.Empty;

        [Display(Name = "Membership ID")]
        public string MembershipIdNo { get; set; } = string.Empty;

        public string Validity { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class ProjectViewModel
    {
        [Required(ErrorMessage = "Project title is required")]
        [Display(Name = "Title")]
        public string ProjectTitle { get; set; } = string.Empty;

        [Required(ErrorMessage = "Funding agency is required")]
        [Display(Name = "Funding Agency")]
        public string FundingAgency { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class StepFViewModel
    {
        // Professional Experience
        public List<ProfessionalExperienceViewModel> Experiences { get; set; } = new();

        // Summary
        public string TotalProfessionalExperience { get; set; } = string.Empty;
        public string TotalAdminExperience { get; set; } = string.Empty;
        public int TotalInstitutions { get; set; }

        // Additional Information
        public List<AwardViewModel> Awards { get; set; } = new();
        public List<MembershipViewModel> Memberships { get; set; } = new();
        public List<ProjectViewModel> Projects { get; set; } = new();

        // Other Information
        [StringLength(2000, ErrorMessage = "Maximum 2000 characters allowed")]
        public string OtherInfo { get; set; } = string.Empty;

        // File Uploads
        public List<IFormFile> ExperienceDocuments { get; set; } = new();
        public List<IFormFile> OtherDocuments { get; set; } = new();
    }
}
