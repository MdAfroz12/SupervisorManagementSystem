using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SupervisorPortal.Models.ViewModels;
using System;
using System.IO;
using System.Linq;

namespace SupervisorPortal.Controllers
{
    public class StepFController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public StepFController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: Display Step F form
        [HttpGet]
        public IActionResult Index()
        {
            var model = new StepFViewModel();

            // Initialize with one empty row for each section
            model.Experiences.Add(new ProfessionalExperienceViewModel());
            model.Awards.Add(new AwardViewModel());
            model.Memberships.Add(new MembershipViewModel());
            model.Projects.Add(new ProjectViewModel());

            return View(model);
        }

        // POST: Handle Step F submission
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(StepFViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            double totalProfessionalYears = 0;
            decimal totalAdminYears = 0;

            // Calculate durations and admin experience
            foreach (var exp in model.Experiences)
            {
                var durationDays = (exp.ToDate - exp.FromDate).TotalDays;
                var durationYears = durationDays / 365.25;
                totalProfessionalYears += durationYears;

                exp.Duration = $"{durationYears:F2} yrs";

                totalAdminYears += exp.AdminExperienceYears;
            }

            model.TotalProfessionalExperience = $"{totalProfessionalYears:F2} yrs";
            model.TotalAdminExperience = $"{totalAdminYears:F2} yrs";
            model.TotalInstitutions = model.Experiences?.Count ?? 0;

            // Handle Experience Documents upload
            if (model.ExperienceDocuments != null && model.ExperienceDocuments.Any())
            {
                foreach (var file in model.ExperienceDocuments)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var path = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "experience", fileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(path)!);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }

            // Handle Other Documents upload
            if (model.OtherDocuments != null && model.OtherDocuments.Any())
            {
                foreach (var file in model.OtherDocuments)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var path = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "other", fileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(path)!);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }

            // TODO: Save Step F data to database

            ViewBag.Message = "Step F details submitted successfully!";
            return View(model);
        }

        // Optional: Add new row dynamically (AJAX)
        [HttpPost]
        public IActionResult AddExperienceRow()
        {
            return PartialView("_ExperienceRowPartial", new ProfessionalExperienceViewModel());
        }

        [HttpPost]
        public IActionResult AddAwardRow()
        {
            return PartialView("_AwardRowPartial", new AwardViewModel());
        }

        [HttpPost]
        public IActionResult AddMembershipRow()
        {
            return PartialView("_MembershipRowPartial", new MembershipViewModel());
        }

        [HttpPost]
        public IActionResult AddProjectRow()
        {
            return PartialView("_ProjectRowPartial", new ProjectViewModel());
        }
    }
}
