using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SupervisorPortal.Models;
using SupervisorPortal.Models.Entities;
using SupervisorPortal.Models.ViewModels;
using SupervisorPortal.Services.Interfaces;

namespace SupervisorPortal.Services
{
    public class SupervisorService : ISupervisorService  
    {
        private readonly SupervisorDbContext _context;

        public SupervisorService(SupervisorDbContext context)
        {
            _context = context;
        }

        // Step A: Personal Details
        public async Task<bool> SavePersonalDetailsAsync(StepAViewModel model, int supervisorId)
        {
            try
            {
                // Check if personal details already exist
                var existingDetail = await _context.PersonalDetails
                    .FirstOrDefaultAsync(p => p.SupervisorId == supervisorId);

                if (existingDetail != null)
                {
                    // Update existing record
                    existingDetail.Surname = model.Surname;
                    existingDetail.MiddleName = model.MiddleName;
                    existingDetail.FirstName = model.FirstName;
                    existingDetail.FatherHusbandName = model.FatherHusbandName;
                    existingDetail.DateOfBirth = model.DateOfBirth;
                    existingDetail.PermanentAddress = model.PermanentAddress;
                    existingDetail.CorrespondenceAddress = model.CorrespondenceAddress;
                    existingDetail.MaritalStatus = model.MaritalStatus;
                    existingDetail.Religion = model.Religion;
                    existingDetail.Nationality = model.Nationality;
                    existingDetail.Caste = model.Caste;
                    existingDetail.IsBackwardClass = model.IsBackwardClass;
                    existingDetail.Category = model.Category;
                    existingDetail.MotherTongue = model.MotherTongue;
                    existingDetail.LanguagesKnown = model.LanguagesKnown;
                    existingDetail.UpdatedDate = DateTime.Now;
                }
                else
                {
                    // Create new record
                    var personalDetail = new PersonalDetail
                    {
                        SupervisorId = supervisorId,
                        Surname = model.Surname,
                        MiddleName = model.MiddleName,
                        FirstName = model.FirstName,
                        FatherHusbandName = model.FatherHusbandName,
                        DateOfBirth = model.DateOfBirth,
                        PermanentAddress = model.PermanentAddress,
                        CorrespondenceAddress = model.CorrespondenceAddress,
                        MaritalStatus = model.MaritalStatus,
                        Religion = model.Religion,
                        Nationality = model.Nationality,
                        Caste = model.Caste,
                        IsBackwardClass = model.IsBackwardClass,
                        Category = model.Category,
                        MotherTongue = model.MotherTongue,
                        LanguagesKnown = model.LanguagesKnown,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now
                    };

                    _context.PersonalDetails.Add(personalDetail);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Log error
                Console.WriteLine($"Error saving personal details: {ex.Message}");
                return false;
            }
        }

        public async Task<PersonalDetail> GetPersonalDetailsAsync(int supervisorId)
        {
            return await _context.PersonalDetails
                .FirstOrDefaultAsync(p => p.SupervisorId == supervisorId);
        }

        // Step B: Education Details
        public async Task<bool> SaveEducationDetailsAsync(StepBViewModel model, int supervisorId)
        {
            try
            {
                // Remove existing education details
                var existingDetails = await _context.EducationDetails
                    .Where(e => e.SupervisorId == supervisorId)
                    .ToListAsync();

                if (existingDetails.Any())
                {
                    _context.EducationDetails.RemoveRange(existingDetails);
                    await _context.SaveChangesAsync();
                }

                // Save new education details
                foreach (var row in model.EducationRows)
                {
                    // Calculate percentage if not provided
                    decimal percentage = 0;
                    if (row.MarksType == "Percentage" && row.TotalMarks > 0)
                    {
                        percentage = (row.MarksObtained / row.TotalMarks) * 100;
                    }
                    else if (row.MarksType == "CGPA")
                    {
                        percentage = row.MarksObtained * 10; // Convert CGPA to percentage (CGPA * 10)
                    }

                    var educationDetail = new EducationDetail
                    {
                        SupervisorId = supervisorId,
                        ExamName = row.ExamName,
                        BoardUniversity = row.BoardUniversity,
                        YearOfPassing = row.YearOfPassing,
                        InstituteName = row.InstituteName,
                        Division = row.Division,
                        MarksType = row.MarksType,
                        MarksObtained = row.MarksObtained,
                        TotalMarks = row.TotalMarks,
                        Percentage = percentage,
                        HighestQualification = model.HighestQualification,
                        OtherQualification = model.OtherQualification,
                        PhdThesisTopic = model.PhdThesisTopic,
                        CreatedDate = DateTime.Now
                    };

                    _context.EducationDetails.Add(educationDetail);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving education details: {ex.Message}");
                return false;
            }
        }

        public async Task<List<EducationDetail>> GetEducationDetailsAsync(int supervisorId)
        {
            return await _context.EducationDetails
                .Where(e => e.SupervisorId == supervisorId)
                .OrderBy(e => e.YearOfPassing)
                .ToListAsync();
        }

        // Step C: Employment Details
        public async Task<bool> SaveEmploymentDetailsAsync(StepCViewModel model, int supervisorId)
        {
            try
            {
                // Remove existing employment details
                var existingDetails = await _context.EmploymentDetails
                    .Where(e => e.SupervisorId == supervisorId)
                    .ToListAsync();

                if (existingDetails.Any())
                {
                    _context.EmploymentDetails.RemoveRange(existingDetails);
                    await _context.SaveChangesAsync();
                }

                // Save new employment details
                foreach (var row in model.EmploymentRows)
                {
                    // Calculate UG experience
                    var ugExperience = (0, 0, 0);
                    if (row.UG_From.HasValue && row.UG_To.HasValue)
                    {
                        ugExperience = CalculateExperience(row.UG_From.Value, row.UG_To.Value);
                    }

                    // Calculate PG experience
                    var pgExperience = (0, 0, 0);
                    if (row.PG_From.HasValue && row.PG_To.HasValue)
                    {
                        pgExperience = CalculateExperience(row.PG_From.Value, row.PG_To.Value);
                    }

                    var employmentDetail = new EmploymentDetail
                    {
                        SupervisorId = supervisorId,
                        InstitutionName = row.InstitutionName,
                        PostHeld = row.PostHeld,
                        Qualification = row.Qualification,
                        UG_From = row.UG_From,
                        UG_To = row.UG_To,
                        UG_TotalYears = ugExperience.Item1,
                        UG_TotalMonths = ugExperience.Item2,
                        UG_TotalDays = ugExperience.Item3,
                        PG_From = row.PG_From,
                        PG_To = row.PG_To,
                        PG_TotalYears = pgExperience.Item1,
                        PG_TotalMonths = pgExperience.Item2,
                        PG_TotalDays = pgExperience.Item3,
                        CreatedDate = DateTime.Now
                    };

                    _context.EmploymentDetails.Add(employmentDetail);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving employment details: {ex.Message}");
                return false;
            }
        }

        public async Task<List<EmploymentDetail>> GetEmploymentDetailsAsync(int supervisorId)
        {
            return await _context.EmploymentDetails
                .Where(e => e.SupervisorId == supervisorId)
                .OrderBy(e => e.UG_From)
                .ToListAsync();
        }

        // Step D: Research Experience
        public async Task<bool> SaveResearchExperienceAsync(StepDViewModel model, int supervisorId)
        {
            try
            {
                // Remove existing research experiences
                var existingResearch = await _context.ResearchExperiences
                    .Where(r => r.SupervisorId == supervisorId)
                    .ToListAsync();

                if (existingResearch.Any())
                {
                    _context.ResearchExperiences.RemoveRange(existingResearch);
                    await _context.SaveChangesAsync();
                }

                // Save new research experiences
                foreach (var row in model.ResearchRows)
                {
                    var experience = CalculateExperience(row.FromDate, row.ToDate);

                    var researchExperience = new ResearchExperience
                    {
                        SupervisorId = supervisorId,
                        Organization = row.Organization,
                        Position = row.Position,
                        FromDate = row.FromDate,
                        ToDate = row.ToDate,
                        DurationYears = experience.Item1,
                        DurationMonths = experience.Item2,
                        DurationDays = experience.Item3,
                        NatureOfResearch = row.NatureOfResearch,
                        CreatedDate = DateTime.Now
                    };

                    _context.ResearchExperiences.Add(researchExperience);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving research experience: {ex.Message}");
                return false;
            }
        }

        public async Task<List<ResearchExperience>> GetResearchExperiencesAsync(int supervisorId)
        {
            return await _context.ResearchExperiences
                .Where(r => r.SupervisorId == supervisorId)
                .OrderBy(r => r.FromDate)
                .ToListAsync();
        }

        public async Task<bool> SavePGApprovalAsync(StepDViewModel model, int supervisorId)
        {
            try
            {
                var existingApproval = await _context.PGApprovalDetails
                    .FirstOrDefaultAsync(p => p.SupervisorId == supervisorId);

                if (existingApproval != null)
                {
                    // Update existing
                    existingApproval.IsApproved = model.IsPGApproved;
                    existingApproval.LetterNo = model.LetterNo;
                    existingApproval.ApprovalDate = model.ApprovalDate;
                    existingApproval.UniversityName = model.UniversityName == "Other"
                        ? model.OtherUniversity
                        : model.UniversityName;
                    existingApproval.UpdatedDate = DateTime.Now;
                }
                else
                {
                    // Create new
                    var pgApproval = new PGApprovalDetail
                    {
                        SupervisorId = supervisorId,
                        IsApproved = model.IsPGApproved,
                        LetterNo = model.LetterNo,
                        ApprovalDate = model.ApprovalDate,
                        UniversityName = model.UniversityName == "Other"
                            ? model.OtherUniversity
                            : model.UniversityName,
                        CreatedDate = DateTime.Now
                    };

                    _context.PGApprovalDetails.Add(pgApproval);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving PG approval: {ex.Message}");
                return false;
            }
        }

        public async Task<PGApprovalDetail> GetPGApprovalAsync(int supervisorId)
        {
            return await _context.PGApprovalDetails
                .FirstOrDefaultAsync(p => p.SupervisorId == supervisorId);
        }

        // Step E: Publications
        public async Task<bool> SavePublicationsAsync(StepEViewModel model, int supervisorId)
        {
            try
            {
                // Remove existing publications
                var existingPublications = await _context.Publications
                    .Where(p => p.SupervisorId == supervisorId)
                    .ToListAsync();

                if (existingPublications.Any())
                {
                    _context.Publications.RemoveRange(existingPublications);
                    await _context.SaveChangesAsync();
                }

                // Save books
                foreach (var book in model.Books)
                {
                    var publication = new Publication
                    {
                        SupervisorId = supervisorId,
                        PublicationType = "Book",
                        Title = book.Title,
                        Authors = book.Authors,
                        Publisher = book.Publisher,
                        Year = book.Year,
                        ISBN_DOI = book.ISBN_DOI,
                        Edition = book.Edition,
                        CreatedDate = DateTime.Now
                    };

                    _context.Publications.Add(publication);
                }

                // Save research papers
                foreach (var paper in model.ResearchPapers)
                {
                    var publication = new Publication
                    {
                        SupervisorId = supervisorId,
                        PublicationType = "ResearchPaper",
                        Title = paper.Title,
                        Authors = paper.Authors,
                        Publisher = paper.Publisher,
                        Year = paper.Year,
                        ISBN_DOI = paper.ISBN_DOI,
                        JournalConference = paper.JournalConference,
                        VolumeIssue = paper.VolumeIssue,
                        Indexing = paper.Indexing,
                        CreatedDate = DateTime.Now
                    };

                    _context.Publications.Add(publication);
                }

                // Save chapters
                foreach (var chapter in model.Chapters)
                {
                    var publication = new Publication
                    {
                        SupervisorId = supervisorId,
                        PublicationType = "Chapter",
                        Title = chapter.Title,
                        Authors = chapter.Authors,
                        Publisher = chapter.Publisher,
                        Year = chapter.Year,
                        ISBN_DOI = chapter.ISBN_DOI,
                        Pages = chapter.Pages,
                        CreatedDate = DateTime.Now
                    };

                    _context.Publications.Add(publication);
                }

                // Save other publications
                foreach (var other in model.OtherPublications)
                {
                    var publication = new Publication
                    {
                        SupervisorId = supervisorId,
                        PublicationType = "Other",
                        Title = other.Title,
                        Authors = other.Authors,
                        Publisher = other.Publisher,
                        Year = other.Year,
                        ReferenceNo = other.ReferenceNo,
                        Status = other.Status,
                        CreatedDate = DateTime.Now
                    };

                    _context.Publications.Add(publication);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving publications: {ex.Message}");
                return false;
            }
        }

        public async Task<List<Publication>> GetPublicationsAsync(int supervisorId)
        {
            return await _context.Publications
                .Where(p => p.SupervisorId == supervisorId)
                .OrderBy(p => p.Year)
                .ThenBy(p => p.PublicationType)
                .ToListAsync();
        }

        // Step F: Professional Experience
        public async Task<bool> SaveProfessionalExperienceAsync(StepFViewModel model, int supervisorId)
        {
            try
            {
                // Remove existing professional experiences
                var existingExperiences = await _context.ProfessionalExperiences
                    .Where(e => e.SupervisorId == supervisorId)
                    .ToListAsync();

                if (existingExperiences.Any())
                {
                    _context.ProfessionalExperiences.RemoveRange(existingExperiences);
                    await _context.SaveChangesAsync();
                }

                // Save new professional experiences
                foreach (var exp in model.Experiences)
                {
                    var experience = CalculateExperience(exp.FromDate, exp.ToDate);

                    var professionalExperience = new ProfessionalExperience
                    {
                        SupervisorId = supervisorId,
                        InstitutionName = exp.InstitutionName,
                        PostHeld = exp.PostHeld,
                        FromDate = exp.FromDate,
                        ToDate = exp.ToDate,
                        DurationYears = experience.Item1,
                        DurationMonths = experience.Item2,
                        DurationDays = experience.Item3,
                        AdminExperienceYears = exp.AdminExperienceYears,
                        NatureOfWork = exp.NatureOfWork,
                        Remarks = exp.Remarks,
                        CreatedDate = DateTime.Now
                    };

                    _context.ProfessionalExperiences.Add(professionalExperience);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving professional experience: {ex.Message}");
                return false;
            }
        }

        public async Task<List<ProfessionalExperience>> GetProfessionalExperiencesAsync(int supervisorId)
        {
            return await _context.ProfessionalExperiences
                .Where(e => e.SupervisorId == supervisorId)
                .OrderBy(e => e.FromDate)
                .ToListAsync();
        }

        // Common Methods
        public async Task<int> GetSupervisorIdByEmailAsync(string email)
        {
            var supervisor = await _context.Supervisors
                .FirstOrDefaultAsync(s => s.Email == email);

            return supervisor?.SupervisorId ?? 0;
        }

        public async Task<bool> IsStepCompletedAsync(int supervisorId, string step)
        {
            return step.ToUpper() switch
            {
                "A" => await _context.PersonalDetails.AnyAsync(p => p.SupervisorId == supervisorId),
                "B" => await _context.EducationDetails.AnyAsync(e => e.SupervisorId == supervisorId),
                "C" => await _context.EmploymentDetails.AnyAsync(e => e.SupervisorId == supervisorId),
                "D" => await _context.ResearchExperiences.AnyAsync(r => r.SupervisorId == supervisorId),
                "E" => await _context.Publications.AnyAsync(p => p.SupervisorId == supervisorId),
                "F" => await _context.ProfessionalExperiences.AnyAsync(p => p.SupervisorId == supervisorId),
                "G" => await _context.ApplicationSubmissions.AnyAsync(a => a.SupervisorId == supervisorId),
                _ => false
            };
        }

        public (int years, int months, int days) CalculateExperience(DateTime fromDate, DateTime toDate)
        {
            if (toDate < fromDate)
                return (0, 0, 0);

            int years = toDate.Year - fromDate.Year;
            int months = toDate.Month - fromDate.Month;
            int days = toDate.Day - fromDate.Day;

            if (days < 0)
            {
                months--;
                days += DateTime.DaysInMonth(toDate.Year, toDate.Month - 1);
            }

            if (months < 0)
            {
                years--;
                months += 12;
            }

            return (years, months, days);
        }

        public string FormatExperience(int years, int months, int days)
        {
            return $"{years} Years {months} Months {days} Days";
        }

        // Note: Other methods (SaveAwardsAsync, SaveMembershipsAsync, etc.) will be implemented
        // based on your specific requirements. These are placeholders.

        public Task<bool> SaveAwardsAsync(List<Award> awards, int supervisorId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SaveMembershipsAsync(List<Membership> memberships, int supervisorId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SaveProjectsAsync(List<Project> projects, int supervisorId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SaveOtherInfoAsync(string otherInfo, int supervisorId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SaveUploadedDocumentsAsync(List<UploadedDocument> documents, int supervisorId)
        {
            throw new NotImplementedException();
        }

        public Task<List<UploadedDocument>> GetUploadedDocumentsAsync(int supervisorId)
        {
            throw new NotImplementedException();
        }

        public Task<string> SubmitFinalApplicationAsync(StepGViewModel model, int supervisorId)
        {
            throw new NotImplementedException();
        }

        public Task<ApplicationSubmission> GetApplicationStatusAsync(int supervisorId)
        {
            throw new NotImplementedException();
        }

        public Task<List<string>> GetPendingDocumentsAsync(int supervisorId)
        {
            throw new NotImplementedException();
        }
    }
}