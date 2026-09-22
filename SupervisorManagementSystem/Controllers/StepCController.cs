using Microsoft.AspNetCore.Mvc;
using SupervisorPortal.Models.ViewModels;
using System;
using System.Linq;

namespace SupervisorPortal.Controllers
{
    public class StepCController : Controller 
    {
        // GET: Display the form
        [HttpGet]
        public IActionResult Index()
        {
            // Initialize with 1 empty row by default
            var model = new StepCViewModel();
            model.EmploymentRows.Add(new EmploymentRowViewModel());
            return View(model);
        }

        // POST: Handle form submission
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(StepCViewModel model)
        {
            if (!ModelState.IsValid)
            {
                // If validation fails, return the same view
                return View(model);
            }

            // Calculate UG, PG, and total experience
            double totalUG = 0, totalPG = 0;

            foreach (var row in model.EmploymentRows)
            {
                // UG Experience
                if (row.UG_From.HasValue && row.UG_To.HasValue)
                {
                    var ugDuration = (row.UG_To.Value - row.UG_From.Value).TotalDays / 365.25;
                    totalUG += ugDuration;
                    row.UG_Total = $"{ugDuration:F2} yrs";
                }

                // PG Experience
                if (row.PG_From.HasValue && row.PG_To.HasValue)
                {
                    var pgDuration = (row.PG_To.Value - row.PG_From.Value).TotalDays / 365.25;
                    totalPG += pgDuration;
                    row.PG_Total = $"{pgDuration:F2} yrs";
                }
            }

            model.TotalUGExperience = $"{totalUG:F2} yrs";
            model.TotalPGExperience = $"{totalPG:F2} yrs";
            model.TotalExperience = $"{(totalUG + totalPG):F2} yrs";

            // TODO: Save the model to database if needed

            ViewBag.Message = "Experience details submitted successfully!";
            return View(model);
        }

        // Optional: Add a new row dynamically (if using AJAX)
        [HttpPost]
        public IActionResult AddRow()
        {
            return PartialView("_EmploymentRowPartial", new EmploymentRowViewModel());
        }
    }
}
