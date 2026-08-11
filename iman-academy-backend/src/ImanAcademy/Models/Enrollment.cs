using System;
using System.Collections.Generic;

namespace ImanAcademy.Models;

// Join entity between ApplicationUser and Course. Has its own Id (rather than a
// composite ApplicationUserId+CourseId key) so a ApplicationUser could re-enroll in the
// same course later and each attempt gets tracked separately; enforce
// "one active enrollment per ApplicationUser/course" with a filtered unique index
// instead (see CoursePlatformDbContext).
public class Enrollment
{
    public Guid Id { get; set; }

    public Guid ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; } = null!;

    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public DateTime EnrolledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public EnrollmentStatus Status { get; set; }
    public decimal? ProgressPercent { get; set; }
}

