using System;

namespace ImanAcademy.DTOs
{
    public class LessonDto
    {
        public int LessonId { get; set; }
        public int? CourseId { get; set; }
        public string Title { get; set; } = null!;
        public string? ContentUrl { get; set; }
        public int OrderIndex { get; set; }
        public bool? IsPreview { get; set; }
    }
}
