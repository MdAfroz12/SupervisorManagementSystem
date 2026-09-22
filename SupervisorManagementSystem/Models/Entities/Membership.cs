using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class Membership
    {
        [Key]
        public int MembershipId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(300)]
        public string Organization { get; set; } = string.Empty;

        // Optional fields
        [StringLength(100)]
        [Display(Name = "Membership Type")]
        public string? MembershipType { get; set; }

        [StringLength(100)]
        [Display(Name = "Membership ID")]
        public string? MembershipIdNo { get; set; }

        [StringLength(100)]
        public string? Validity { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
