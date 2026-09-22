using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SupervisorPortal.Models.ViewModels;
using System;
using System.IO;
using System.Linq;

namespace SupervisorPortal.Controllers
{
    public class StepGController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public StepGController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: Display Step G form
        [HttpGet]
        public IActionResult Index()
        {
            var model = new StepGViewModel();

            // Initialize example mandatory documents
            model.Documents.Add(new DocumentViewModel { DocumentType = "ID Proof", IsRequired = true });
            model.Documents.Add(new DocumentViewModel { DocumentType = "Address Proof", IsRequired = true });
            model.Documents.Add(new DocumentViewModel { DocumentType = "Photo", IsRequired = false });

            // Default Declaration Date = Today
            model.DeclarationDate = DateTime.Today;

            return View(model);
        }

        // POST: Handle Step G submission
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(StepGViewModel model)
        {
            if (!ModelState.IsValid)
            {
                UpdateProgress(model);
                return View(model);
            }

            // Handle individual document uploads
            foreach (var doc in model.Documents)
            {
                if (doc.DocumentFile != null)
                {
                    var fileName = Path.GetFileName(doc.DocumentFile.FileName);
                    var path = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "documents", fileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(path)!);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        doc.DocumentFile.CopyTo(stream);
                    }

                    doc.ExistingFilePath = $"/uploads/documents/{fileName}";
                    doc.FileName = fileName;
                    doc.IsUploaded = true;
                }
            }

            // Handle bulk file uploads
            if (model.BulkUploadFiles != null && model.BulkUploadFiles.Any())
            {
                foreach (var file in model.BulkUploadFiles)
                {
                    var bulkFileName = Path.GetFileName(file.FileName);
                    var bulkPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "bulk", bulkFileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(bulkPath)!);

                    using (var stream = new FileStream(bulkPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }

            // Calculate progress
            UpdateProgress(model);

            // TODO: Save Step G data (documents + declaration) to database

            ViewBag.Message = "Step G submitted successfully!";
            return View(model);
        }

        // Helper method to calculate progress
        private void UpdateProgress(StepGViewModel model)
        {
            model.TotalDocs = model.Documents.Count;
            model.MandatoryDocs = model.Documents.Count(d => d.IsRequired);
            model.UploadedDocs = model.Documents.Count(d => d.IsUploaded);
            model.PendingDocs = model.TotalDocs - model.UploadedDocs;

            model.ProgressPercentage = model.TotalDocs == 0 ? 0 :
                (int)((model.UploadedDocs * 100.0) / model.TotalDocs);

            // Optionally, create a summary string
            model.DocumentsSummary = $"Uploaded {model.UploadedDocs}/{model.TotalDocs} documents. " +
                                     $"{model.PendingDocs} pending. " +
                                     $"Mandatory: {model.MandatoryDocs}";
        }

        // Optional: Add a new document row dynamically via AJAX
        [HttpPost]
        public IActionResult AddDocumentRow()
        {
            return PartialView("_DocumentRowPartial", new DocumentViewModel());
        }
    }
}
