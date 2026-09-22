using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class Publication
    {
        [Key]
        public int PublicationId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Publication Type")]
        public string PublicationType { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Authors { get; set; } = string.Empty;

        // Optional fields
        [StringLength(300)]
        public string? Publisher { get; set; }

        [Required]
        [Range(1900, 2100)]
        public int Year { get; set; }

        [StringLength(200)]
        [Display(Name = "ISBN/DOI")]
        public string? ISBN_DOI { get; set; }

        [StringLength(300)]
        [Display(Name = "Journal/Conference")]
        public string? JournalConference { get; set; }

        [StringLength(100)]
        [Display(Name = "Volume/Issue")]
        public string? VolumeIssue { get; set; }

        [StringLength(100)]
        public string? Indexing { get; set; }

        [StringLength(50)]
        public string? Pages { get; set; }

        [StringLength(50)]
        public string? Edition { get; set; }

        [StringLength(100)]
        [Display(Name = "Reference No.")]
        public string? ReferenceNo { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }

        [StringLength(500)]
        [Display(Name = "Document Path")]
        public string? DocumentPath { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
