using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SupervisorPortal.Models.ViewModels;
using System;
using System.IO;
using System.Linq;

namespace SupervisorPortal.Controllers
{
    public class StepDController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public StepDController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: Display the Step D form
        [HttpGet]
        public IActionResult Index()
        {
            var model = new StepDViewModel();
            model.ResearchRows.Add(new ResearchRowViewModel()); // Initialize with one empty row
            return View(model);
        }

        // POST: Handle Step D submission
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(StepDViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            double totalResearchYears = 0;

            // Calculate duration for each research row
            foreach (var row in model.ResearchRows)
            {
                var durationDays = (row.ToDate - row.FromDate).TotalDays;
                var durationYears = durationDays / 365.25;
                totalResearchYears += durationYears;
                row.Duration = $"{durationYears:F2} yrs";
            }

            model.TotalResearchExperience = $"{totalResearchYears:F2} yrs";

            // Handle Approval Document upload
            if (model.ApprovalDocument != null)
            {
                var approvalFileName = Path.GetFileName(model.ApprovalDocument.FileName);
                var approvalPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "approval", approvalFileName);

                // Ensure folder exists
                Directory.CreateDirectory(Path.GetDirectoryName(approvalPath)!);

                using (var stream = new FileStream(approvalPath, FileMode.Create))
                {
                    model.ApprovalDocument.CopyTo(stream);
                }

                model.ExistingApprovalDocPath = $"/uploads/approval/{approvalFileName}";
            }

            // Handle multiple research document uploads
            if (model.ResearchDocuments != null && model.ResearchDocuments.Any())
            {
                foreach (var file in model.ResearchDocuments)
                {
                    var researchFileName = Path.GetFileName(file.FileName);
                    var researchPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "research", researchFileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(researchPath)!);

                    using (var stream = new FileStream(researchPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }

            // TODO: Save Step D data to database

            ViewBag.Message = "Step D details submitted successfully!";
            return View(model);
        }

        // Optional: Add a new research row dynamically (AJAX)
        [HttpPost]
        public IActionResult AddResearchRow()
        {
            return PartialView("_ResearchRowPartial", new ResearchRowViewModel());
        }
    }
}
