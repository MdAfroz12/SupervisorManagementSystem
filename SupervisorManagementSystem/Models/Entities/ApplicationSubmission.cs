using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class ApplicationSubmission
    {
        [Key]
        public int SubmissionId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [StringLength(50)]
        [Display(Name = "Application Number")]
        public string? ApplicationNumber { get; set; }

        public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(500)]
        [Display(Name = "Digital Signature")]
        public string DigitalSignature { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "Declaration Date")]
        public DateTime DeclarationDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Submitted";

        [Display(Name = "Reviewer Comments")]
        public string? ReviewerComments { get; set; }

        public DateTime? ReviewDate { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
