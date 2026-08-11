namespace ImanAcademy.Models;

public class QuizQuestion
{
    public Guid Id { get; set; }

    public Guid QuizStepId { get; set; }
    public QuizStep QuizStep { get; set; } = null!;

    public string Prompt { get; set; } = string.Empty;
    public QuestionType Type { get; set; }

    // Only meaningful when Type == ShortAnswer
    public string? CorrectAnswer { get; set; }

    public int Points { get; set; }

    public ICollection<QuizOption> Options { get; set; } = new List<QuizOption>();
}

public class QuizOption
{
    public Guid Id { get; set; }

    public Guid QuizQuestionId { get; set; }
    public QuizQuestion QuizQuestion { get; set; } = null!;

    public string Text { get; set; } = string.Empty;

    // Replaces the TS model's QuizQuestion.correctOptionIds: flattening
    // "is this option correct" onto the option itself is simpler to query
    // and index in a relational schema than an id array on the question.
    public bool IsCorrect { get; set; }
}
