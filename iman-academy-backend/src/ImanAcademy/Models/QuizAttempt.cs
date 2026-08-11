using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;

namespace ImanAcademy.Models;


public class QuizAttempt
{
    public Guid Id { get; set; }

    public Guid ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; } = null!;

    public Guid QuizStepId { get; set; }
    public QuizStep QuizStep { get; set; } = null!;

    // 1, 2, 3... per (ApplicationUserId, QuizStepId) - lets AllowRetake/attempt
    // limits be enforced by counting rows instead of needing a mutable
    // "attempt count" column on Enrollment.
    public int AttemptNumber { get; set; }

    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int ScorePercent { get; set; }
    public AttemptStatus Status { get; set; }

    public ICollection<QuizAnswer> Answers { get; set; } = new List<QuizAnswer>();
}

public class QuizAnswer
{
    public Guid Id { get; set; }

    public Guid QuizAttemptId { get; set; }
    public QuizAttempt QuizAttempt { get; set; } = null!;

    public Guid QuizQuestionId { get; set; }
    public QuizQuestion QuizQuestion { get; set; } = null!;

    // Only meaningful when the question's Type == ShortAnswer
    public string? ShortAnswerText { get; set; }

    public bool IsCorrect { get; set; }
    public int PointsAwarded { get; set; }

    // Chosen options for single/multi-choice and true/false questions
    public ICollection<QuizAnswerOption> SelectedOptions { get; set; } = new List<QuizAnswerOption>();
}

// Join entity: a single answer can select more than one option (multi-choice).
public class QuizAnswerOption
{
    public Guid QuizAnswerId { get; set; }
    public QuizAnswer QuizAnswer { get; set; } = null!;

    public Guid QuizOptionId { get; set; }
    public QuizOption QuizOption { get; set; } = null!;
}
