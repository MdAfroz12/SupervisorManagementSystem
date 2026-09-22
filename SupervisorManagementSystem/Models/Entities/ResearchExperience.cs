using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class ResearchExperience
    {
        [Key]
        public int ResearchId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(300)]
        public string Organization { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Position { get; set; } = string.Empty;

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

        [Required]
        [StringLength(200)]
        [Display(Name = "Nature of Research")]
        public string NatureOfResearch { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
