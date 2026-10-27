namespace ImanAcademy.Models;


public enum ContentStatus
{
    Draft,
    Published,
    Archived
}

public enum CourseLevel
{
    Beginner,
    Intermediate,
    Advanced
}

public enum StepType
{
    Content,
    Video,
    Quiz
}

public enum QuestionType
{
    SingleChoice,
    MultiChoice,
    TrueFalse,
    ShortAnswer
}

public enum EnrollmentStatus
{
    PendingRequest,
    Paid,
    Active,
    Cancelled
}

public enum AttemptStatus
{
    InProgress,
    Passed,
    Failed,
    Abandoned
}

