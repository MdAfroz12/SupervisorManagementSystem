using Microsoft.EntityFrameworkCore;
using SupervisorPortal.Models.Entities;

namespace SupervisorPortal.Models
{
    public class SupervisorDbContext : DbContext
    { 
        public SupervisorDbContext(DbContextOptions<SupervisorDbContext> options)
            : base(options)
        {
        } 

        // Existing table 
        public DbSet<Supervisor> Supervisors { get; set; } 

        // New tables
        public DbSet<PersonalDetail> PersonalDetails { get; set; }
        public DbSet<EducationDetail> EducationDetails { get; set; }
        public DbSet<EmploymentDetail> EmploymentDetails { get; set; }
        public DbSet<ResearchExperience> ResearchExperiences { get; set; }
        public DbSet<PGApprovalDetail> PGApprovalDetails { get; set; }
        public DbSet<Publication> Publications { get; set; }
        public DbSet<ProfessionalExperience> ProfessionalExperiences { get; set; }
        public DbSet<Award> Awards { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<OtherInformation> OtherInformations { get; set; }
        public DbSet<UploadedDocument> UploadedDocuments { get; set; }
        public DbSet<ApplicationSubmission> ApplicationSubmissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<PersonalDetail>()
                .HasOne<Supervisor>()
                .WithMany()
                .HasForeignKey(p => p.SupervisorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Add other configurations as needed
        }
    }
}