using System;
using System.Collections.Generic;

namespace ImanAcademy.Models;

public partial class Lesson
{
    public int LessonId { get; set; }

    public int? CourseId { get; set; }

    public string Title { get; set; } = null!;

    public string? ContentUrl { get; set; }

    public int OrderIndex { get; set; }

    public bool? IsPreview { get; set; }

    public virtual Course? Course { get; set; }

    public virtual ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
}
