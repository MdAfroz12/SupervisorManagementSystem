using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class EmploymentDetail
    {
        [Key]
        public int EmploymentId { get; set; }

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
        [StringLength(300)]
        [Display(Name = "Qualification")]
        public string Qualification { get; set; } = string.Empty;

        // ===================== UG DETAILS =====================

        [DataType(DataType.Date)]
        [Display(Name = "UG From")]
        public DateTime? UG_From { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "UG To")]
        public DateTime? UG_To { get; set; }

        [Display(Name = "UG Years")]
        public int UG_TotalYears { get; set; } = 0;

        [Display(Name = "UG Months")]
        public int UG_TotalMonths { get; set; } = 0;

        [Display(Name = "UG Days")]
        public int UG_TotalDays { get; set; } = 0;

        // ===================== PG DETAILS =====================

        [DataType(DataType.Date)]
        [Display(Name = "PG From")]
        public DateTime? PG_From { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "PG To")]
        public DateTime? PG_To { get; set; }

        [Display(Name = "PG Years")]
        public int PG_TotalYears { get; set; } = 0;

        [Display(Name = "PG Months")]
        public int PG_TotalMonths { get; set; } = 0;

        [Display(Name = "PG Days")]
        public int PG_TotalDays { get; set; } = 0;

        // ===================== COMMON =====================

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
