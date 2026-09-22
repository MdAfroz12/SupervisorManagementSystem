using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class EducationDetail
    {
        [Key]
        public int EducationId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(200)]
        [Display(Name = "Examination Name")]
        public string ExamName { get; set; } = string.Empty;

        [Required]
        [StringLength(300)]
        [Display(Name = "Board/University")]
        public string BoardUniversity { get; set; } = string.Empty;

        [Required]
        [Range(1950, 2100)]
        [Display(Name = "Year of Passing")]
        public int YearOfPassing { get; set; }

        [Required]
        [StringLength(300)]
        [Display(Name = "Institute Name")]
        public string InstituteName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Division { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        [Display(Name = "Marks Type")]
        public string MarksType { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        [Display(Name = "Marks Obtained")]
        public decimal MarksObtained { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        [Display(Name = "Total Marks")]
        public decimal TotalMarks { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal Percentage { get; set; }

        [Required]
        [StringLength(200)]
        [Display(Name = "Highest Qualification")]
        public string HighestQualification { get; set; } = string.Empty;

        [StringLength(300)]
        [Display(Name = "Other Qualification")]
        public string? OtherQualification { get; set; }

        [Display(Name = "PhD Thesis Topic")]
        public string? PhdThesisTopic { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
