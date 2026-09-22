using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.EntityFrameworkCore;
using SupervisorPortal.Models;
using SupervisorPortal.Services.Interfaces;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks; 

namespace SupervisorPortal.Services
{
    public class PdfService : IPdfService
    {
        private readonly SupervisorDbContext _context;

        public PdfService(SupervisorDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // APPLICATION PDF
        // =====================================================
        public async Task<byte[]> GenerateApplicationPdfAsync(int supervisorId, string applicationNumber)
        {
            using var memoryStream = new MemoryStream();

            PdfWriter writer = new PdfWriter(memoryStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            await AddHeader(document, applicationNumber);
            await AddPersonalDetails(document, supervisorId);
            await AddEducationDetails(document, supervisorId);
            await AddEmploymentDetails(document, supervisorId);
            await AddResearchExperience(document, supervisorId);
            await AddPublications(document, supervisorId);
            await AddProfessionalExperience(document, supervisorId);
            AddDeclaration(document);

            document.Close();
            return memoryStream.ToArray();
        }

        // =====================================================
        // SUMMARY PDF
        // =====================================================
        public async Task<byte[]> GenerateSummaryPdfAsync(int supervisorId)
        {
            using var memoryStream = new MemoryStream();

            PdfWriter writer = new PdfWriter(memoryStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            document.Add(new Paragraph("Application Summary")
                .SetBold()
                .SetFontSize(18)
                .SetTextAlignment(TextAlignment.CENTER));

            document.Add(new Paragraph(" "));

            var supervisor = await _context.Supervisors
                .FirstOrDefaultAsync(s => s.SupervisorId == supervisorId);

            if (supervisor != null)
            {
                string fullName =
                    $"{supervisor.FirstName ?? ""} {supervisor.LastName ?? ""}".Trim();

                document.Add(new Paragraph($"Name : {supervisor.FullName}"));
                document.Add(new Paragraph($"Email : {supervisor.Email}"));
                document.Add(new Paragraph($"Mobile : {supervisor.MobileNumber ?? "N/A"}"));

            }


            var submission = await _context.ApplicationSubmissions
                .FirstOrDefaultAsync(a => a.SupervisorId == supervisorId);

            if (submission != null)
            {
                document.Add(new Paragraph($"Application Number : {submission.ApplicationNumber}"));
                document.Add(new Paragraph($"Submission Date : {submission.SubmissionDate:dd/MM/yyyy}"));
                document.Add(new Paragraph($"Status : {submission.Status}"));
            }

            document.Close();
            return memoryStream.ToArray();
        }

        // =====================================================
        // HELPERS
        // =====================================================
        public string GenerateApplicationNumber(int supervisorId)
        {
            var year = DateTime.Now.Year;
            var random = new Random().Next(1000, 9999);
            return $"RTMNU/PhD/{year}/{supervisorId:D4}/{random}";
        }

        private async Task AddHeader(Document document, string applicationNumber)
        {
            document.Add(new Paragraph("RASHTRASANT TUKADOJI MAHARAJ NAGPUR UNIVERSITY")
                .SetBold()
                .SetFontSize(16)
                .SetTextAlignment(TextAlignment.CENTER));

            document.Add(new Paragraph("PhD Supervisor Registration Application")
                .SetBold()
                .SetFontSize(14)
                .SetTextAlignment(TextAlignment.CENTER));

            document.Add(new Paragraph($"Application Number : {applicationNumber}")
                .SetTextAlignment(TextAlignment.CENTER));

            document.Add(new Paragraph(" "));
        }

        private async Task AddPersonalDetails(Document document, int supervisorId)
        {
            document.Add(new Paragraph("A. PERSONAL DETAILS").SetBold());

            var personal = await _context.PersonalDetails
                .FirstOrDefaultAsync(x => x.SupervisorId == supervisorId);

            if (personal != null)
            {
                document.Add(new Paragraph($"Name : {personal.FirstName} {personal.MiddleName} {personal.Surname}"));
                document.Add(new Paragraph($"Date of Birth : {personal.DateOfBirth:dd/MM/yyyy}"));
                document.Add(new Paragraph($"Father/Husband : {personal.FatherHusbandName}"));
                document.Add(new Paragraph($"Address : {personal.PermanentAddress}"));
            }

            document.Add(new Paragraph(" "));
        }

        private async Task AddEducationDetails(Document document, int supervisorId)
        {
            document.Add(new Paragraph("B. EDUCATION DETAILS").SetBold());

            var list = await _context.EducationDetails
                .Where(x => x.SupervisorId == supervisorId)
                .ToListAsync();

            if (!list.Any()) return;

            Table table = new Table(4).UseAllAvailableWidth();

            table.AddHeaderCell("Examination");
            table.AddHeaderCell("University");
            table.AddHeaderCell("Year");
            table.AddHeaderCell("Percentage");

            foreach (var e in list)
            {
                table.AddCell(e.ExamName);
                table.AddCell(e.BoardUniversity);
                table.AddCell(e.YearOfPassing.ToString());
                table.AddCell($"{e.Percentage:F2}%");
            }

            document.Add(table);
            document.Add(new Paragraph(" "));
        }

        private async Task AddEmploymentDetails(Document document, int supervisorId)
        {
            document.Add(new Paragraph("C. EMPLOYMENT DETAILS").SetBold());
            document.Add(new Paragraph("Employment details will be added here."));
            document.Add(new Paragraph(" "));
        }

        private async Task AddResearchExperience(Document document, int supervisorId)
        {
            document.Add(new Paragraph("D. RESEARCH EXPERIENCE").SetBold());
            document.Add(new Paragraph("Research experience details will be added here."));
            document.Add(new Paragraph(" "));
        }

        private async Task AddPublications(Document document, int supervisorId)
        {
            document.Add(new Paragraph("E. PUBLICATIONS").SetBold());

            var pubs = await _context.Publications
                .Where(p => p.SupervisorId == supervisorId)
                .ToListAsync();

            int i = 1;
            foreach (var p in pubs)
            {
                document.Add(new Paragraph($"{i}. {p.Title} ({p.Year})"));
                i++;
            }

            document.Add(new Paragraph(" "));
        }

        private async Task AddProfessionalExperience(Document document, int supervisorId)
        {
            document.Add(new Paragraph("F. PROFESSIONAL EXPERIENCE").SetBold());
            document.Add(new Paragraph("Professional experience details will be added here."));
            document.Add(new Paragraph(" "));
        }

        private void AddDeclaration(Document document)
        {
            document.Add(new Paragraph("DECLARATION").SetBold());

            document.Add(new Paragraph(
                "I hereby declare that all the information provided is true to the best of my knowledge."
            ));

            document.Add(new Paragraph(" "));
            document.Add(new Paragraph("Date : ____________"));
            document.Add(new Paragraph("Signature : ____________"));
        }

        public Task<byte[]> GenerateExperienceCertificateAsync(int employmentId)
            => throw new NotImplementedException();

        public Task<byte[]> MergePdfsAsync(System.Collections.Generic.List<byte[]> pdfFiles)
            => throw new NotImplementedException();

        public Task<byte[]> AddWatermarkAsync(byte[] pdfBytes, string watermarkText)
            => throw new NotImplementedException();
    }
}
