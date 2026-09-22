using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SupervisorPortal.Models.ViewModels;
using System;
using System.IO;
using System.Linq;

namespace SupervisorPortal.Controllers
{
    public class StepEController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public StepEController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: Display the Step E form
        [HttpGet]
        public IActionResult Index()
        {
            var model = new StepEViewModel();

            // Initialize with one empty row for each category
            model.Books.Add(new PublicationRowViewModel { PublicationType = "Book" });
            model.ResearchPapers.Add(new PublicationRowViewModel { PublicationType = "ResearchPaper" });
            model.Chapters.Add(new PublicationRowViewModel { PublicationType = "Chapter" });
            model.OtherPublications.Add(new PublicationRowViewModel { PublicationType = "Other" });

            return View(model);
        }

        // POST: Handle Step E submission
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(StepEViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Calculate totals
            model.TotalBooks = model.Books?.Count ?? 0;
            model.TotalPapers = model.ResearchPapers?.Count ?? 0;
            model.TotalChapters = model.Chapters?.Count ?? 0;
            model.TotalOthers = model.OtherPublications?.Count ?? 0;
            model.TotalPublications = model.TotalBooks + model.TotalPapers + model.TotalChapters + model.TotalOthers;

            // Handle Book document uploads
            if (model.BookDocuments != null && model.BookDocuments.Any())
            {
                foreach (var file in model.BookDocuments)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var path = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "books", fileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(path)!);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }

            // Handle Bulk Upload file (Excel/CSV)
            if (model.BulkUploadFile != null)
            {
                var bulkFileName = Path.GetFileName(model.BulkUploadFile.FileName);
                var bulkPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "bulk", bulkFileName);

                Directory.CreateDirectory(Path.GetDirectoryName(bulkPath)!);

                using (var stream = new FileStream(bulkPath, FileMode.Create))
                {
                    model.BulkUploadFile.CopyTo(stream);
                }

                // TODO: Optionally, read Excel/CSV and populate the publication lists
            }

            // TODO: Save Step E data to database

            ViewBag.Message = "Step E publication details submitted successfully!";
            return View(model);
        }

        // Optional: Add a new row dynamically for a category via AJAX
        [HttpPost]
        public IActionResult AddPublicationRow(string category)
        {
            var row = new PublicationRowViewModel { PublicationType = category };
            return PartialView("_PublicationRowPartial", row);
        }
    }
}
