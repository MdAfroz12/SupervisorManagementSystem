using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class UploadedDocument
    {
        [Key]
        public int DocumentId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Document Type")]
        public string DocumentType { get; set; } = string.Empty;

        [Required]
        [StringLength(300)]
        [Display(Name = "Document Name")]
        public string DocumentName { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        [Display(Name = "File Path")]
        public string FilePath { get; set; } = string.Empty;

        [Display(Name = "File Size")]
        public long FileSize { get; set; }

        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        [Display(Name = "Verified")]
        public bool IsVerified { get; set; } = false;
    }
}
