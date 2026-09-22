using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace SupervisorPortal.Models.ViewModels
{
    public class StepAViewModel
    {
        // Photo Upload
        [Display(Name = "Photograph")]
        public IFormFile? PhotoFile { get; set; } = null; // Nullable, optional file

        [Display(Name = "Current Photo")]
        public string ExistingPhotoPath { get; set; } = string.Empty;

        // Name Details
        [Required(ErrorMessage = "Surname is required")]
        [StringLength(100)]
        public string Surname { get; set; } = string.Empty;

        [StringLength(100)]
        [Display(Name = "Middle Name")]
        public string MiddleName { get; set; } = string.Empty;

        [Required(ErrorMessage = "First Name is required")]
        [StringLength(100)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        // Father/Husband Name
        [Required(ErrorMessage = "Father/Husband Name is required")]
        [StringLength(200)]
        [Display(Name = "Father/Husband Name")]
        public string FatherHusbandName { get; set; } = string.Empty;

        // Date of Birth
        [Required(ErrorMessage = "Date of Birth is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateTime DateOfBirth { get; set; } = DateTime.Now;

        // Address Details
        [Required(ErrorMessage = "Permanent Address is required")]
        [Display(Name = "Permanent Address")]
        public string PermanentAddress { get; set; } = string.Empty;

        [Required(ErrorMessage = "Correspondence Address is required")]
        [Display(Name = "Correspondence Address")]
        public string CorrespondenceAddress { get; set; } = string.Empty;

        // Personal Information
        [Required(ErrorMessage = "Marital Status is required")]
        [Display(Name = "Marital Status")]
        public string MaritalStatus { get; set; } = string.Empty;

        [Required(ErrorMessage = "Religion is required")]
        public string Religion { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nationality is required")]
        public string Nationality { get; set; } = string.Empty;

        [Required(ErrorMessage = "Caste is required")]
        public string Caste { get; set; } = string.Empty;

        // Backward Class
        [Display(Name = "Belong to Backward Class?")]
        public bool IsBackwardClass { get; set; }

        [Display(Name = "Category")]
        public string Category { get; set; } = string.Empty;

        // Language Details
        [Required(ErrorMessage = "Mother Tongue is required")]
        [Display(Name = "Mother Tongue")]
        public string MotherTongue { get; set; } = string.Empty;

        [Required(ErrorMessage = "Languages Known is required")]
        [Display(Name = "Languages Known")]
        public string LanguagesKnown { get; set; } = string.Empty;
    }
}
