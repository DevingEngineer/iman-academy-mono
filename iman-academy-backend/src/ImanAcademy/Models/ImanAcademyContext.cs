using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Models;

public partial class ImanAcademyContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{

    public ImanAcademyContext(DbContextOptions<ImanAcademyContext> options)
        : base(options)
    {
    }
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Instructor> Instructors => Set<Instructor>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<Module> Modules => Set<Module>();
    public DbSet<SubModule> SubModules => Set<SubModule>();
    public DbSet<Step> Steps => Set<Step>();
    public DbSet<StepAttachment> StepAttachments => Set<StepAttachment>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<QuizOption> QuizOptions => Set<QuizOption>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<CourseReview> CourseReviews => Set<CourseReview>();
    public DbSet<ModuleReview> ModuleReviews => Set<ModuleReview>();
    public DbSet<StepReview> StepReviews => Set<StepReview>();
    public DbSet<QuizAttempt> QuizAttempts => Set<QuizAttempt>();
    public DbSet<QuizAnswer> QuizAnswers => Set<QuizAnswer>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(rt => rt.TokenHash).IsUnique();
            entity.HasOne(rt => rt.User)
                  .WithMany()
                  .HasForeignKey(rt => rt.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        // ---------- Course ----------
        modelBuilder.Entity<Course>(e =>
        {
            e.Property(c => c.Title).HasMaxLength(200).IsRequired();
            e.Property(c => c.Slug).HasMaxLength(200).IsRequired();
            e.Property(c => c.Language).HasMaxLength(20).IsRequired();
            e.Property(c => c.Currency).HasMaxLength(3).IsRequired();
            e.Property(c => c.Price).HasColumnType("decimal(10,2)");
            e.HasIndex(c => c.Slug).IsUnique();

            e.HasMany(c => c.Modules)
                .WithOne(m => m.Course)
                .HasForeignKey(m => m.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- Tag / Course <-> Tag (many-to-many via join entity) ----------
        modelBuilder.Entity<Tag>(e =>
        {
            e.Property(t => t.Name).HasMaxLength(50).IsRequired();
            e.HasIndex(t => t.Name).IsUnique();
        });

        modelBuilder.Entity<CourseTag>(e =>
        {
            e.HasKey(ct => new { ct.CourseId, ct.TagId });

            e.HasOne(ct => ct.Course)
                .WithMany(c => c.CourseTags)
                .HasForeignKey(ct => ct.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(ct => ct.Tag)
                .WithMany(t => t.CourseTags)
                .HasForeignKey(ct => ct.TagId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- Course <-> Instructor (many-to-many via join entity) ----------
        modelBuilder.Entity<CourseInstructor>(e =>
        {
            e.HasKey(ci => new { ci.CourseId, ci.InstructorId });

            e.HasOne(ci => ci.Course)
                .WithMany(c => c.CourseInstructors)
                .HasForeignKey(ci => ci.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(ci => ci.Instructor)
                .WithMany(i => i.CourseInstructors)
                .HasForeignKey(ci => ci.InstructorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        //// ---------- ApplicationUser ----------
        //modelBuilder.Entity<ApplicationUser>(e =>
        //{
        //    e.Property(s => s.Name).HasMaxLength(200).IsRequired();
        //    e.Property(s => s.Email).HasMaxLength(320).IsRequired();
        //    e.HasIndex(s => s.Email).IsUnique();
        //});

        // ---------- Enrollment (ApplicationUser <-> Course join with payload) ----------
        modelBuilder.Entity<Enrollment>(e =>
        {
            e.Property(en => en.ProgressPercent).HasColumnType("decimal(5,2)");

            e.HasOne(en => en.ApplicationUser)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(en => en.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(en => en.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(en => en.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Active enrollment uniqueness is enforced by EnrollmentService so that
            // cancelled enrollment history can be retained for re-enrollment.
            e.HasIndex(en => new { en.ApplicationUserId, en.CourseId })
                .IsUnique(false);
        });

        // ---------- Module ----------
        modelBuilder.Entity<Module>(e =>
        {
            e.Property(m => m.Title).HasMaxLength(200).IsRequired();
            e.HasIndex(m => new { m.CourseId, m.Order });

            e.HasMany(m => m.SubModules)
                .WithOne(sm => sm.Module)
                .HasForeignKey(sm => sm.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- SubModule ----------
        modelBuilder.Entity<SubModule>(e =>
        {
            e.Property(sm => sm.Title).HasMaxLength(200).IsRequired();
            e.HasIndex(sm => new { sm.ModuleId, sm.Order });

            e.HasMany(sm => sm.Steps)
                .WithOne(s => s.SubModule)
                .HasForeignKey(s => s.SubModuleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- Step (TPC: no shared table, one table per concrete type) ----------
        // Step itself is never mapped to a table - only ContentStep/VideoStep/QuizStep
        // are. Querying DbSet<Step> issues a UNION ALL across ContentSteps, VideoSteps
        // and QuizSteps under the hood.
        modelBuilder.Entity<Step>(e =>
        {
            e.UseTpcMappingStrategy();

            e.Property(s => s.Title).HasMaxLength(200).IsRequired();

            // StepType has no [Column] mapping needed - EF maps it as a normal
            // column, duplicated onto each of the three tables below.
        });

        modelBuilder.Entity<ContentStep>(e =>
        {
            e.ToTable("ContentSteps");
            e.HasIndex(cs => new { cs.SubModuleId, cs.Order });

            e.HasMany(cs => cs.Attachments)
                .WithOne(a => a.ContentStep)
                .HasForeignKey(a => a.ContentStepId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<VideoStep>(e =>
        {
            e.ToTable("VideoSteps");
            e.HasIndex(vs => new { vs.SubModuleId, vs.Order });
        });

        modelBuilder.Entity<QuizStep>(e =>
        {
            e.ToTable("QuizSteps");
            e.HasIndex(qs => new { qs.SubModuleId, qs.Order });

            e.HasMany(qs => qs.Questions)
                .WithOne(q => q.QuizStep)
                .HasForeignKey(q => q.QuizStepId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- QuizQuestion / QuizOption ----------
        modelBuilder.Entity<QuizQuestion>(e =>
        {
            e.Property(q => q.Prompt).HasMaxLength(1000).IsRequired();

            e.HasMany(q => q.Options)
                .WithOne(o => o.QuizQuestion)
                .HasForeignKey(o => o.QuizQuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuizOption>(e =>
        {
            e.Property(o => o.Text).HasMaxLength(500).IsRequired();
        });

        // ---------- StepAttachment ----------
        modelBuilder.Entity<StepAttachment>(e =>
        {
            e.Property(a => a.Name).HasMaxLength(200).IsRequired();
            e.Property(a => a.Url).HasMaxLength(2048).IsRequired();
            e.Property(a => a.MimeType).HasMaxLength(100).IsRequired();
        });

        // ---------- Reviews ----------
        // One review per ApplicationUser per target - editing overwrites via UpdatedAt
        // rather than allowing a pile of duplicate reviews.
        modelBuilder.Entity<CourseReview>(e =>
        {
            e.Property(r => r.Comment).HasMaxLength(2000);
            e.HasIndex(r => new { r.ApplicationUserId, r.CourseId }).IsUnique();

            e.HasOne(r => r.ApplicationUser)
                .WithMany(s => s.CourseReviews)
                .HasForeignKey(r => r.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(r => r.Course)
                .WithMany(c => c.Reviews)
                .HasForeignKey(r => r.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ModuleReview>(e =>
        {
            e.Property(r => r.Comment).HasMaxLength(2000);
            e.HasIndex(r => new { r.ApplicationUserId, r.ModuleId }).IsUnique();

            e.HasOne(r => r.ApplicationUser)
                .WithMany(s => s.ModuleReviews)
                .HasForeignKey(r => r.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(r => r.Module)
                .WithMany(m => m.Reviews)
                .HasForeignKey(r => r.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StepReview>(e =>
        {
            e.Property(r => r.Comment).HasMaxLength(2000);

            // StepId has no HasOne/HasForeignKey - see the comment on
            // StepReview in Models/Review.cs for why (TPC has no shared
            // Steps table to reference). Index only, enforced in code.
            e.HasIndex(r => new { r.ApplicationUserId, r.StepId }).IsUnique();

            e.HasOne(r => r.ApplicationUser)
                .WithMany(s => s.StepReviews)
                .HasForeignKey(r => r.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- Quiz attempt history ----------
        modelBuilder.Entity<QuizAttempt>(e =>
        {
            e.HasIndex(a => new { a.ApplicationUserId, a.QuizStepId, a.AttemptNumber }).IsUnique();

            e.HasOne(a => a.ApplicationUser)
                .WithMany(s => s.QuizAttempts)
                .HasForeignKey(a => a.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(a => a.QuizStep)
                .WithMany(qs => qs.Attempts)
                .HasForeignKey(a => a.QuizStepId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuizAnswer>(e =>
        {
            e.Property(a => a.ShortAnswerText).HasMaxLength(2000);

            e.HasOne(a => a.QuizAttempt)
                .WithMany(qa => qa.Answers)
                .HasForeignKey(a => a.QuizAttemptId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(a => a.QuizQuestion)
                .WithMany()
                .HasForeignKey(a => a.QuizQuestionId)
                .OnDelete(DeleteBehavior.Restrict); // don't let deleting a question cascade into wiping historical answers
        });

        modelBuilder.Entity<QuizAnswerOption>(e =>
        {
            e.HasKey(ao => new { ao.QuizAnswerId, ao.QuizOptionId });

            e.HasOne(ao => ao.QuizAnswer)
                .WithMany(a => a.SelectedOptions)
                .HasForeignKey(ao => ao.QuizAnswerId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(ao => ao.QuizOption)
                .WithMany()
                .HasForeignKey(ao => ao.QuizOptionId)
                .OnDelete(DeleteBehavior.Restrict);
        });


    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
