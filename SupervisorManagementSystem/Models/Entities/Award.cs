using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class Award
    {
        [Key]
        public int AwardId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(300)]
        [Display(Name = "Award Name")]
        public string AwardName { get; set; } = string.Empty;

        [Required]
        [StringLength(300)]
        [Display(Name = "Organization")]
        public string Organization { get; set; } = string.Empty;

        [Required]
        [Range(1900, 2100)]
        public int Year { get; set; }

        // Optional fields
        [StringLength(100)]
        public string? Level { get; set; } // International, National, State, etc.

        public string? Description { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
