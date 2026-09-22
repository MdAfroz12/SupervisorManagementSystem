using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupervisorPortal.Models;
using SupervisorPortal.Models.Entities;
using SupervisorPortal.Models.ViewModels;
using SupervisorPortal.Services.Interfaces;

namespace SupervisorPortal.Controllers
{
    public class StepAController : Controller
    {
        private readonly SupervisorDbContext _context;
        private readonly ISupervisorService _supervisorService;
        private readonly IFileUploadService _fileUploadService;

        public StepAController(
            SupervisorDbContext context,
            ISupervisorService supervisorService,
            IFileUploadService fileUploadService)
        {
            _context = context;
            _supervisorService = supervisorService;
            _fileUploadService = fileUploadService;
        }

        // =========================
        // GET PERSONAL DETAILS
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetPersonalDetails()
        {
            try
            {
                var email = HttpContext.Session.GetString("Email");
                if (string.IsNullOrEmpty(email))
                    return Json(new { success = false, redirect = "/Account/Login" });

                var supervisorId =
                    await _supervisorService.GetSupervisorIdByEmailAsync(email);

                if (supervisorId == 0)
                    return Json(new { success = false, redirect = "/Account/Login" });

                var personalDetails =
                    await _supervisorService.GetPersonalDetailsAsync(supervisorId);

                if (personalDetails == null)
                    return Json(new { success = true, data = new object() });

                var data = new
                {
                    personalDetails.Surname,
                    personalDetails.MiddleName,
                    personalDetails.FirstName,
                    personalDetails.FatherHusbandName,
                    DateOfBirth = personalDetails.DateOfBirth.ToString("yyyy-MM-dd"),
                    personalDetails.PermanentAddress,
                    personalDetails.CorrespondenceAddress,
                    personalDetails.MaritalStatus,
                    personalDetails.Religion,
                    personalDetails.Nationality,
                    personalDetails.Caste,
                    personalDetails.IsBackwardClass,
                    personalDetails.Category,
                    personalDetails.MotherTongue,
                    personalDetails.LanguagesKnown,
                    personalDetails.PhotoPath
                };

                return Json(new { success = true, data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // =========================
        // SAVE PERSONAL DETAILS
        // =========================
        [HttpPost]
        public async Task<IActionResult> SavePersonalDetails(
            [FromBody] StepAViewModel model)
        {
            try
            {
                var email = HttpContext.Session.GetString("Email");
                if (string.IsNullOrEmpty(email))
                    return Json(new { success = false, redirect = "/Account/Login" });

                var supervisorId =
                    await _supervisorService.GetSupervisorIdByEmailAsync(email);

                if (supervisorId == 0)
                    return Json(new { success = false, redirect = "/Account/Login" });

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return Json(new { success = false, errors });
                }

                var minDate = DateTime.Now.AddYears(-18);
                if (model.DateOfBirth > minDate)
                {
                    return Json(new
                    {
                        success = false,
                        errors = new List<string>
                        {
                            "You must be at least 18 years old"
                        }
                    });
                }

                var result =
                    await _supervisorService.SavePersonalDetailsAsync(
                        model, supervisorId);

                if (!result)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Failed to save personal details"
                    });
                }

                return Json(new
                {
                    success = true,
                    message = "Personal details saved successfully!",
                    nextStep = "B"
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // =========================
        // UPLOAD PHOTO
        // =========================
        [HttpPost]
        public async Task<IActionResult> UploadPhoto()
        {
            try
            {
                var email = HttpContext.Session.GetString("Email");
                if (string.IsNullOrEmpty(email))
                    return Json(new { success = false, redirect = "/Account/Login" });

                var supervisorId =
                    await _supervisorService.GetSupervisorIdByEmailAsync(email);

                if (supervisorId == 0)
                    return Json(new { success = false, redirect = "/Account/Login" });

                var file = Request.Form.Files.FirstOrDefault();
                if (file == null || file.Length == 0)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Please select a photo to upload"
                    });
                }

                var photoPath =
                    await _fileUploadService.UploadPhotoAsync(file, supervisorId);

                var personalDetail = await _context.PersonalDetails
                    .FirstOrDefaultAsync(p => p.SupervisorId == supervisorId);

                if (personalDetail != null)
                {
                    personalDetail.PhotoPath = photoPath;
                    personalDetail.UpdatedDate = DateTime.Now;
                    await _context.SaveChangesAsync();
                }

                return Json(new
                {
                    success = true,
                    message = "Photo uploaded successfully!",
                    photoPath
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // =========================
        // REMOVE PHOTO
        // =========================
        [HttpPost]
        public async Task<IActionResult> RemovePhoto()
        {
            try
            {
                var email = HttpContext.Session.GetString("Email");
                if (string.IsNullOrEmpty(email))
                    return Json(new { success = false, redirect = "/Account/Login" });

                var supervisorId =
                    await _supervisorService.GetSupervisorIdByEmailAsync(email);

                if (supervisorId == 0)
                    return Json(new { success = false, redirect = "/Account/Login" });

                var personalDetail = await _context.PersonalDetails
                    .FirstOrDefaultAsync(p => p.SupervisorId == supervisorId);

                if (personalDetail != null &&
                    !string.IsNullOrEmpty(personalDetail.PhotoPath))
                {
                    await _fileUploadService.DeleteFileAsync(
                        personalDetail.PhotoPath);

                    personalDetail.PhotoPath = null;
                    personalDetail.UpdatedDate = DateTime.Now;
                    await _context.SaveChangesAsync();
                }

                return Json(new
                {
                    success = true,
                    message = "Photo removed successfully!"
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // =========================
        // CLEAR FORM
        // =========================
        [HttpPost]
        public IActionResult ClearForm()
        {
            return Json(new
            {
                success = true,
                message = "Form cleared successfully!"
            });
        }

        // =========================
        // FIELD VALIDATION
        // =========================
        [HttpGet]
        public IActionResult ValidateForm(string field, string value)
        {
            try
            {
                var errors = new List<string>();

                switch (field.ToLower())
                {
                    case "dateofbirth":
                        if (DateTime.TryParse(value, out var dob))
                        {
                            if (dob > DateTime.Now.AddYears(-18))
                                errors.Add("You must be at least 18 years old");
                        }
                        else
                        {
                            errors.Add("Invalid date format");
                        }
                        break;

                    case "email":
                        if (!value.Contains("@") || !value.Contains("."))
                            errors.Add("Invalid email format");
                        break;

                    case "mobile":
                        if (value.Length != 10 || !value.All(char.IsDigit))
                            errors.Add("Mobile number must be 10 digits");
                        break;
                }

                return Json(new
                {
                    success = errors.Count == 0,
                    errors
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
