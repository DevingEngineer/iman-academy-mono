using System;
using System.Collections.Generic;

namespace ImanAcademy.Models;

public partial class StudentAnswer
{
    public int AnswerId { get; set; }

    public int? AttemptId { get; set; }

    public int? QuestionId { get; set; }

    public int? SelectedOptionId { get; set; }

    public virtual QuizAttempt? Attempt { get; set; }

    public virtual Question? Question { get; set; }

    public virtual Option? SelectedOption { get; set; }
}
