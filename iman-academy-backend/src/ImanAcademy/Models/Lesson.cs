using System;
using System.Collections.Generic;

namespace ImanAcademy.Models;

public class Module
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public ContentStatus Status { get; set; }

    public ICollection<SubModule> SubModules { get; set; } = new List<SubModule>();
    public ICollection<ModuleReview> Reviews { get; set; } = new List<ModuleReview>();
}