using System;
using System.Collections.Generic;

namespace ImanAcademy.Models;

public partial class Quiz
{
    public int QuizId { get; set; }

    public int? LessonId { get; set; }

    public string Title { get; set; } = null!;

    public int? PassingScore { get; set; }

    public int? TimeLimitMinutes { get; set; }

    public virtual Lesson? Lesson { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
}
