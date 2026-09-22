using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupervisorPortal.Models;
using SupervisorPortal.Models.Entities;
using SupervisorPortal.Models.ViewModels;
using SupervisorPortal.Services.Interfaces;

namespace SupervisorPortal.Controllers
{
    public class StepBController : Controller
    {
        private readonly SupervisorDbContext _context;
        private readonly ISupervisorService _supervisorService;

        public StepBController(
            SupervisorDbContext context,
            ISupervisorService supervisorService)
        {
            _context = context;
            _supervisorService = supervisorService;
        }

        // =========================
        // GET EDUCATION DETAILS
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetEducationDetails()
        {
            try
            {
                var email = HttpContext.Session.GetString("Email");
                if (string.IsNullOrEmpty(email))
                {
                    return Json(new { success = false, redirect = "/Account/Login" });
                }

                var supervisorId =
                    await _supervisorService.GetSupervisorIdByEmailAsync(email);

                if (supervisorId == 0)
                {
                    return Json(new { success = false, redirect = "/Account/Login" });
                }

                var educationDetails =
                    await _supervisorService.GetEducationDetailsAsync(supervisorId);

                var highestQualification = "";
                var otherQualification = "";
                var phdThesisTopic = "";

                if (educationDetails.Any())
                {
                    highestQualification = educationDetails.First().HighestQualification;
                    otherQualification = educationDetails.First().OtherQualification;
                    phdThesisTopic = educationDetails.First().PhdThesisTopic;
                }

                var data = new
                {
                    EducationRows = educationDetails.Select(edu => new
                    {
                        ExamName = edu.ExamName,
                        BoardUniversity = edu.BoardUniversity,
                        YearOfPassing = edu.YearOfPassing,
                        InstituteName = edu.InstituteName,
                        Division = edu.Division,
                        MarksType = edu.MarksType,
                        MarksObtained = edu.MarksObtained,
                        TotalMarks = edu.TotalMarks,
                        Percentage =
                            edu.Percentage.ToString("F2") +
                            (edu.MarksType == "CGPA" ? " CGPA" : "%")
                    }).ToList(),
                    HighestQualification = highestQualification,
                    OtherQualification = otherQualification,
                    PhdThesisTopic = phdThesisTopic
                };

                return Json(new { success = true, data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // =========================
        // SAVE EDUCATION DETAILS
        // =========================
        [HttpPost]
        public async Task<IActionResult> SaveEducationDetails(
            [FromBody] StepBViewModel model)
        {
            try
            {
                var email = HttpContext.Session.GetString("Email");
                if (string.IsNullOrEmpty(email))
                {
                    return Json(new { success = false, redirect = "/Account/Login" });
                }

                var supervisorId =
                    await _supervisorService.GetSupervisorIdByEmailAsync(email);

                if (supervisorId == 0)
                {
                    return Json(new { success = false, redirect = "/Account/Login" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return Json(new { success = false, errors });
                }

                var validationErrors =
                    ValidateEducationRows(model.EducationRows);

                if (validationErrors.Any())
                {
                    return Json(new { success = false, errors = validationErrors });
                }

                if (string.IsNullOrEmpty(model.HighestQualification))
                {
                    return Json(new
                    {
                        success = false,
                        errors = new List<string>
                        {
                            "Highest qualification is required"
                        }
                    });
                }

                if (model.HighestQualification == "Other" &&
                    string.IsNullOrEmpty(model.OtherQualification))
                {
                    return Json(new
                    {
                        success = false,
                        errors = new List<string>
                        {
                            "Please specify other qualification"
                        }
                    });
                }

                var result =
                    await _supervisorService.SaveEducationDetailsAsync(
                        model, supervisorId);

                if (!result)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Failed to save education details"
                    });
                }

                return Json(new
                {
                    success = true,
                    message = "Education details saved successfully!",
                    nextStep = "C"
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        // =========================
        // ADD EDUCATION ROW
        // =========================
        [HttpPost]
        public IActionResult AddEducationRow(
            [FromBody] EducationRowViewModel row)
        {
            try
            {
                var errors = ValidateEducationRow(row);
                if (errors.Any())
                {
                    return Json(new { success = false, errors });
                }

                if (row.MarksType == "Percentage" && row.TotalMarks > 0)
                {
                    var percentage =
                        (row.MarksObtained / row.TotalMarks) * 100;
                    row.Percentage = percentage.ToString("F2") + "%";
                }
                else if (row.MarksType == "CGPA")
                {
                    row.Percentage =
                        row.MarksObtained.ToString("F2") + " CGPA";
                }

                return Json(new
                {
                    success = true,
                    row,
                    message = "Education row added successfully!"
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        [HttpPost]
        public IActionResult RemoveEducationRow([FromQuery] int index)
        {
            try
            {
                return Json(new
                {
                    success = true,
                    message = "Education row removed successfully!"
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        [HttpPost]
        public IActionResult ClearEducationForm()
        {
            try
            {
                return Json(new
                {
                    success = true,
                    message = "Education form cleared successfully!"
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        // =========================
        // CALCULATE PERCENTAGE
        // =========================
        [HttpGet]
        public IActionResult CalculatePercentage(
            [FromQuery] string marksType,
            [FromQuery] decimal obtained,
            [FromQuery] decimal total)
        {
            try
            {
                string percentage = "";

                if (marksType == "Percentage" && total > 0)
                {
                    var pct = (obtained / total) * 100;
                    percentage = pct.ToString("F2") + "%";
                }
                else if (marksType == "CGPA")
                {
                    if (obtained > 10)
                    {
                        return Json(new
                        {
                            success = false,
                            message = "CGPA cannot be more than 10"
                        });
                    }

                    percentage = obtained.ToString("F2") + " CGPA";
                }

                return Json(new
                {
                    success = true,
                    percentage
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        // =========================
        // GET UNIVERSITIES
        // =========================
        [HttpGet]
        public IActionResult GetUniversities()
        {
            try
            {
                var universities = new List<string>
                {
                    "Mahatma Gandhi Antarrashtriya Hindi Vishwavidyalaya, Wardha",
                    "University of Mumbai",
                    "Savitribai Phule Pune University",
                    "Rashtrasant Tukadoji Maharaj Nagpur University",
                    "Dr. Babasaheb Ambedkar Marathwada University",
                    "Shivaji University, Kolhapur",
                    "Sant Gadge Baba Amravati University",
                    "Kavayitri Bahinabai Chaudhari North Maharashtra University",
                    "Swami Ramanand Teerth Marathwada University",
                    "Punyashlok Ahilyadevi Holkar Solapur University",
                    "Gondwana University, Gadchiroli",
                    "SNDT Women's University",
                    "Dr. Babasaheb Ambedkar Technological University",
                    "COEP Technological University",
                    "Maharashtra University of Health Sciences",
                    "Maharashtra Animal & Fishery Sciences University",
                    "Maharashtra State Skills University",
                    "Maharashtra International Sports University",
                    "Kavi Kulaguru Kalidas Sanskrit University",
                    "Mahatma Phule Krishi Vidyapeeth",
                    "Dr. Panjabrao Deshmukh Krishi Vidyapeeth",
                    "Dr. Balasaheb Sawant Konkan Krishi Vidyapeeth",
                    "Vasantrao Naik Marathwada Krishi Vidyapeeth",
                    "Maharashtra National Law University, Mumbai",
                    "Maharashtra National Law University, Nagpur",
                    "Maharashtra National Law University, Aurangabad",
                    "Tata Institute of Social Sciences",
                    "Tata Institute of Fundamental Research",
                    "Homi Bhabha National Institute",
                    "Bharati Vidyapeeth",
                    "Datta Meghe Institute of Medical Sciences",
                    "Gokhale Institute of Politics and Economics",
                    "Indira Gandhi Institute of Development Research",
                    "Defence Institute of Advanced Technology",
                    "Central Institute of Fisheries Education",
                    "Deccan College Post-Graduate & Research Institute",
                    "Amity University, Mumbai",
                    "Ajeenkya D Y Patil University",
                    "ATLAS SkillTech University",
                    "MIT World Peace University",
                    "Sandip University",
                    "Sanjay Ghodawat University",
                    "Somaiya Vidyavihar University",
                    "Vishwakarma University",
                    "Vijaybhoomi University",
                    "MGM University",
                    "Symbiosis Skills and Professional University",
                    "D Y Patil International University",
                    "Pillai University",
                    "FLAME University",
                    "G H Raisoni University",
                    "Others"
                };

                return Json(new { success = true, universities });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // =========================
        // VALIDATIONS
        // =========================
        private List<string> ValidateEducationRows(
            List<EducationRowViewModel> rows)
        {
            var errors = new List<string>();

            if (rows == null || !rows.Any())
            {
                errors.Add("At least one education record is required");
                return errors;
            }

            var has10th =
                rows.Any(r => r.ExamName.Contains("10th") || r.ExamName.Contains("10"));
            var has12th =
                rows.Any(r => r.ExamName.Contains("12th") || r.ExamName.Contains("12"));

            if (!has10th)
                errors.Add("10th Standard record is required");

            if (!has12th)
                errors.Add("12th Standard record is required");

            for (int i = 0; i < rows.Count; i++)
            {
                var rowErrors = ValidateEducationRow(rows[i]);
                if (rowErrors.Any())
                {
                    errors.Add($"Row {i + 1}: {string.Join(", ", rowErrors)}");
                }
            }

            return errors;
        }

        private List<string> ValidateEducationRow(EducationRowViewModel row)
        {
            var errors = new List<string>();

            if (string.IsNullOrEmpty(row.ExamName))
                errors.Add("Examination name is required");

            if (string.IsNullOrEmpty(row.BoardUniversity))
                errors.Add("Board/University is required");

            if (row.YearOfPassing < 1950 ||
                row.YearOfPassing > DateTime.Now.Year)
                errors.Add($"Year must be between 1950 and {DateTime.Now.Year}");

            if (string.IsNullOrEmpty(row.InstituteName))
                errors.Add("Institute name is required");

            if (string.IsNullOrEmpty(row.Division))
                errors.Add("Division is required");

            if (string.IsNullOrEmpty(row.MarksType))
                errors.Add("Marks type is required");

            if (row.MarksObtained <= 0)
                errors.Add("Marks obtained must be greater than 0");

            if (row.TotalMarks <= 0)
                errors.Add("Total marks must be greater than 0");

            if (row.MarksType == "Percentage" &&
                row.MarksObtained > row.TotalMarks)
                errors.Add("Obtained marks cannot be greater than total marks");

            if (row.MarksType == "CGPA" &&
                row.MarksObtained > 10)
                errors.Add("CGPA cannot be more than 10");

            return errors;
        }
    }
}
