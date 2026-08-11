using System;
using System.Collections.Generic;
using System.Reflection;

namespace ImanAcademy.Models;

public partial class Course
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }

    public CourseLevel Level { get; set; }
    public string Language { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = string.Empty;
    public ContentStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Module> Modules { get; set; } = new List<Module>();
    public ICollection<CourseInstructor> CourseInstructors { get; set; } = new List<CourseInstructor>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public ICollection<CourseTag> CourseTags { get; set; } = new List<CourseTag>();
    public ICollection<CourseReview> Reviews { get; set; } = new List<CourseReview>();
}
