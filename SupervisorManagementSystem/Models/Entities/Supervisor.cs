using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupervisorPortal.Models.Entities
{
    public class Supervisor
    {
        [Key]
        public int SupervisorId { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? LastName { get; set; }

        [Required]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [StringLength(15)]
        public string? MobileNumber { get; set; }

        [StringLength(20)]
        public string? AadharNumber { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public bool IsActive { get; set; } = true;

        // ✅ Derived property (DB me column nahi banega)
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}".Trim();

        // ✅ Navigation property (null warning fix)
        public ICollection<EmploymentDetail> EmploymentDetails { get; set; }
            = new List<EmploymentDetail>();
    }
}
