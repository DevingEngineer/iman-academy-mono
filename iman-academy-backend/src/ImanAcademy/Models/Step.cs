namespace ImanAcademy.Models;


// Mapped as Table-Per-Concrete-type (TPC): ContentStep, VideoStep and
// QuizStep each get their own table with every column - including the
// inherited ones - and there's no shared "Steps" table. EF Core builds
// queries against the abstract Step type as a UNION ALL across the three.
//
// TPC has no shared PK/table, so it doesn't get an automatic discriminator
// the way TPH does. StepType is kept as an explicit, self-reported column
// on every table instead - each subtype sets it in its constructor - so
// callers can still tell them apart (e.g. in a raw SQL UNION, or once
// materialized as a Step) without inspecting the CLR type. This mirrors
// the `stepType` discriminant field from the original TS union.
public abstract class Step
{
    public Guid Id { get; set; }

    public Guid SubModuleId { get; set; }
    public SubModule SubModule { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public bool IsFreePreview { get; set; }
    public ContentStatus Status { get; set; }

    // Set by each subtype's constructor - protected set so it can't drift
    // out of sync with the actual CLR type from outside the hierarchy.
    public StepType StepType { get; protected set; }
}

public class ContentStep : Step
{
    public ContentStep() => StepType = Models.StepType.Content;

    public string Body { get; set; } = string.Empty;

    public ICollection<StepAttachment> Attachments { get; set; } = new List<StepAttachment>();
}

public class VideoStep : Step
{
    public VideoStep() => StepType = Models.StepType.Video;

    public string VideoUrl { get; set; } = string.Empty;
    public int DurationSeconds { get; set; }
    public string? CaptionsUrl { get; set; }
    public string? Transcript { get; set; }
}

public class QuizStep : Step
{
    public QuizStep() => StepType = Models.StepType.Quiz;

    public int PassingScorePercent { get; set; }
    public bool AllowRetake { get; set; }
    public int? TimeLimitSeconds { get; set; }

    public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    public ICollection<QuizAttempt> Attempts { get; set; } = new List<QuizAttempt>();
}

