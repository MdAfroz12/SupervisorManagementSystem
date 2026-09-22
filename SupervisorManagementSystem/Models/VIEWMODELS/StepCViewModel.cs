using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.ViewModels
{
    public class EmploymentRowViewModel
    {
        [Required(ErrorMessage = "Institution name is required")]
        [Display(Name = "Institution")]
        public string InstitutionName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Post held is required")]
        [Display(Name = "Post")]
        public string PostHeld { get; set; } = string.Empty;

        [Required(ErrorMessage = "Qualification is required")]
        [Display(Name = "Qualification")]
        public string Qualification { get; set; } = string.Empty;

        // UG Experience
        [DataType(DataType.Date)]
        [Display(Name = "UG From")]
        public DateTime? UG_From { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "UG To")]
        public DateTime? UG_To { get; set; }

        [Display(Name = "UG Total")]
        public string UG_Total { get; set; } = string.Empty;

        // PG Experience
        [DataType(DataType.Date)]
        [Display(Name = "PG From")]
        public DateTime? PG_From { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "PG To")]
        public DateTime? PG_To { get; set; }

        [Display(Name = "PG Total")]
        public string PG_Total { get; set; } = string.Empty;
    }

    public class StepCViewModel
    {
        public List<EmploymentRowViewModel> EmploymentRows { get; set; } = new List<EmploymentRowViewModel>();

        [Display(Name = "Total UG Experience")]
        public string TotalUGExperience { get; set; } = string.Empty;

        [Display(Name = "Total PG Experience")]
        public string TotalPGExperience { get; set; } = string.Empty;

        [Display(Name = "Overall Total Experience")]
        public string TotalExperience { get; set; } = string.Empty;
    }
}
