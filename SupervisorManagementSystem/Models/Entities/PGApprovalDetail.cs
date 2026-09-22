using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class PGApprovalDetail
    {
        [Key]
        public int ApprovalId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [Display(Name = "PG Approved")]
        public bool IsApproved { get; set; } = false;

        [StringLength(100)]
        [Display(Name = "Letter No.")]
        public string? LetterNo { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Approval Date")]
        public DateTime? ApprovalDate { get; set; }

        [StringLength(300)]
        [Display(Name = "University Name")]
        public string? UniversityName { get; set; }

        [StringLength(500)]
        [Display(Name = "Document Path")]
        public string? DocumentPath { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // ✅ ADD THIS (IMPORTANT)
        public DateTime? UpdatedDate { get; set; }
    }
}
