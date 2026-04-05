using System;
using System.Collections.Generic;

namespace ImanAcademy.Models;

public partial class QuizAttempt
{
    public int AttemptId { get; set; }

    public int? UserId { get; set; }

    public int? QuizId { get; set; }

    public int? Score { get; set; }

    public string? Status { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public virtual Quiz? Quiz { get; set; }

    public virtual ICollection<StudentAnswer> StudentAnswers { get; set; } = new List<StudentAnswer>();

    public virtual User? User { get; set; }
}
