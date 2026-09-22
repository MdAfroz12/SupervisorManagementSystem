using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(500)]
        [Display(Name = "Project Title")]
        public string ProjectTitle { get; set; } = string.Empty;

        [Required]
        [StringLength(300)]
        [Display(Name = "Funding Agency")]
        public string FundingAgency { get; set; } = string.Empty;

        // Optional fields
        [StringLength(100)]
        public string? Role { get; set; }

        [StringLength(100)]
        public string? Duration { get; set; }

        public decimal? Amount { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Ongoing";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
