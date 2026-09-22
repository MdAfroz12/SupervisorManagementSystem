using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class PersonalDetail
    {
        [Key]
        public int PersonalDetailId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        // Optional
        [StringLength(500)]
        public string? PhotoPath { get; set; }

        [Required]
        [StringLength(100)]
        public string Surname { get; set; } = string.Empty;

        // Optional
        [StringLength(100)]
        public string? MiddleName { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        [Display(Name = "Father/Husband Name")]
        public string FatherHusbandName { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [Display(Name = "Permanent Address")]
        public string PermanentAddress { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Correspondence Address")]
        public string CorrespondenceAddress { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Display(Name = "Marital Status")]
        public string MaritalStatus { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Religion { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Nationality { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Caste { get; set; } = string.Empty;

        [Display(Name = "Backward Class")]
        public bool IsBackwardClass { get; set; }

        // Optional
        [StringLength(50)]
        public string? Category { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Mother Tongue")]
        public string MotherTongue { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        [Display(Name = "Languages Known")]
        public string LanguagesKnown { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    }
}
