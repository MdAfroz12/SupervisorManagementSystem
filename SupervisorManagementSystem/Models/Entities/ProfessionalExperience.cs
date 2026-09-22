using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class ProfessionalExperience
    {
        [Key]
        public int ExperienceId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(300)]
        [Display(Name = "Institution Name")]
        public string InstitutionName { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        [Display(Name = "Post Held")]
        public string PostHeld { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "From Date")]
        public DateTime FromDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "To Date")]
        public DateTime ToDate { get; set; }

        [Display(Name = "Years")]
        public int DurationYears { get; set; } = 0;

        [Display(Name = "Months")]
        public int DurationMonths { get; set; } = 0;

        [Display(Name = "Days")]
        public int DurationDays { get; set; } = 0;

        [Display(Name = "Admin Experience (Years)")]
        public decimal AdminExperienceYears { get; set; } = 0;

        // Optional fields
        [StringLength(200)]
        [Display(Name = "Nature of Work")]
        public string? NatureOfWork { get; set; }

        [StringLength(500)]
        public string? Remarks { get; set; }

        [StringLength(500)]
        [Display(Name = "Document Path")]
        public string? DocumentPath { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
