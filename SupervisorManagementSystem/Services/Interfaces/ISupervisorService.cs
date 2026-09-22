using SupervisorPortal.Models.Entities;
using SupervisorPortal.Models.ViewModels;

namespace SupervisorPortal.Services.Interfaces
{
    public interface ISupervisorService
    {
        // Step A: Personal Details
        Task<bool> SavePersonalDetailsAsync(StepAViewModel model, int supervisorId);
        Task<PersonalDetail> GetPersonalDetailsAsync(int supervisorId);

        // Step B: Education Details
        Task<bool> SaveEducationDetailsAsync(StepBViewModel model, int supervisorId);
        Task<List<EducationDetail>> GetEducationDetailsAsync(int supervisorId);

        // Step C: Employment Details
        Task<bool> SaveEmploymentDetailsAsync(StepCViewModel model, int supervisorId);
        Task<List<EmploymentDetail>> GetEmploymentDetailsAsync(int supervisorId);

        // Step D: Research Experience
        Task<bool> SaveResearchExperienceAsync(StepDViewModel model, int supervisorId);
        Task<List<ResearchExperience>> GetResearchExperiencesAsync(int supervisorId);
        Task<bool> SavePGApprovalAsync(StepDViewModel model, int supervisorId);
        Task<PGApprovalDetail> GetPGApprovalAsync(int supervisorId);

        // Step E: Publications
        Task<bool> SavePublicationsAsync(StepEViewModel model, int supervisorId);
        Task<List<Publication>> GetPublicationsAsync(int supervisorId);

        // Step F: Professional Experience
        Task<bool> SaveProfessionalExperienceAsync(StepFViewModel model, int supervisorId);
        Task<List<ProfessionalExperience>> GetProfessionalExperiencesAsync(int supervisorId);
        Task<bool> SaveAwardsAsync(List<Award> awards, int supervisorId);
        Task<bool> SaveMembershipsAsync(List<Membership> memberships, int supervisorId);
        Task<bool> SaveProjectsAsync(List<Project> projects, int supervisorId);
        Task<bool> SaveOtherInfoAsync(string otherInfo, int supervisorId);

        // Step G: Documents & Final Submit
        Task<bool> SaveUploadedDocumentsAsync(List<UploadedDocument> documents, int supervisorId);
        Task<List<UploadedDocument>> GetUploadedDocumentsAsync(int supervisorId);
        Task<string> SubmitFinalApplicationAsync(StepGViewModel model, int supervisorId);

        // Common Methods
        Task<int> GetSupervisorIdByEmailAsync(string email);
        Task<bool> IsStepCompletedAsync(int supervisorId, string step);
        Task<ApplicationSubmission> GetApplicationStatusAsync(int supervisorId);
        Task<List<string>> GetPendingDocumentsAsync(int supervisorId);

        // Experience Calculation
        (int years, int months, int days) CalculateExperience(DateTime fromDate, DateTime toDate);
        string FormatExperience(int years, int months, int days);
    }
}