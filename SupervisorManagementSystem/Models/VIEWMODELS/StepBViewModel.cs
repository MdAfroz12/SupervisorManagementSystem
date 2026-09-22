using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SupervisorPortal.Models.ViewModels
{
    public class EducationRowViewModel
    {
        [Required(ErrorMessage = "Examination name is required")]
        [Display(Name = "Examination")]
        public string ExamName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Board/University is required")]
        [Display(Name = "Board/University")]
        public string BoardUniversity { get; set; } = string.Empty;

        [Required(ErrorMessage = "Year of passing is required")]
        [Range(1950, 2100, ErrorMessage = "Please enter valid year")]
        [Display(Name = "Year")]
        public int YearOfPassing { get; set; }

        [Required(ErrorMessage = "Institute name is required")]
        [Display(Name = "Institute")]
        public string InstituteName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Division is required")]
        public string Division { get; set; } = string.Empty;

        [Required(ErrorMessage = "Marks type is required")]
        [Display(Name = "Marks Type")]
        public string MarksType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Marks obtained is required")]
        [Display(Name = "Obtained")]
        public decimal MarksObtained { get; set; }

        [Required(ErrorMessage = "Total marks is required")]
        [Display(Name = "Total")]
        public decimal TotalMarks { get; set; }

        [Display(Name = "Percentage/CGPA")]
        public string Percentage { get; set; } = string.Empty;

        // For 10th/12th - auto calculated
        public bool IsStaticExam { get; set; } = false;
    }

    public class StepBViewModel
    {
        [Display(Name = "Education Rows")]
        public List<EducationRowViewModel> EducationRows { get; set; } = new List<EducationRowViewModel>();

        [Required(ErrorMessage = "Highest qualification is required")]
        [Display(Name = "Highest Qualification")]
        public string HighestQualification { get; set; } = string.Empty;

        [Display(Name = "Other Qualification")]
        public string OtherQualification { get; set; } = string.Empty;

        [Display(Name = "PhD Thesis Topic")]
        public string PhdThesisTopic { get; set; } = string.Empty;
    }
}
