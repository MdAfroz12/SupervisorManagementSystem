using System;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.Entities
{
    public class OtherInformation
    {
        [Key]
        public int InfoId { get; set; }

        [Required]
        public int SupervisorId { get; set; }

        [Display(Name = "Additional Information")]
        public string? AdditionalInfo { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
