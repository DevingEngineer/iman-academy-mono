using ImanAcademy.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ImanAcademy.DTOs;


public class CourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public CourseLevel? Level { get; set; }
    public string? Language { get; set; } = string.Empty;
    public decimal? Price { get; set; }
    public string? Currency { get; set; } = string.Empty;
    public ContentStatus Status { get; set; }
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
//public class CourseSyllabusDto : CourseDto
//{
//    public List<ModuleSyllabusDto> Modules { get; set; } = new();
//}   
public class CreateCourseDto
{
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Slug { get; set; } = string.Empty;


    public string? Description { get; set; } = string.Empty;

    public string? ThumbnailUrl { get; set; }

    public CourseLevel? Level { get; set; }

    [MaxLength(20)]
    public string? Language { get; set; } = string.Empty;

    public decimal? Price { get; set; }

    [MaxLength(3)]
    public string? Currency { get; set; } = string.Empty;

    public ContentStatus? Status { get; set; } = ContentStatus.Draft;

    // Tag names, e.g. ["react", "beginner-friendly"] - matched to existing
    // tags case-insensitively, new ones are created automatically.
    public List<string>? Tags { get; set; } = new();
}

// PUT is a full replace here, so the update shape matches create exactly.
public class UpdateCourseDto : CreateCourseDto
{
}

public class ModuleDto
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public ContentStatus Status { get; set; }
}
//public class ModuleSyllabusDto : ModuleDto
//{
//    public List<SubModuleDto> SubModules { get; set; } = new();
//}
public class CreateModuleDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Order { get; set; }

    [Range(0, int.MaxValue)]
    public int? EstimatedDurationMinutes { get; set; }

    public ContentStatus Status { get; set; } = ContentStatus.Draft;
}
public class UpdateModuleDto : CreateModuleDto
{
}


public class SubModuleDto
{
    public Guid Id { get; set; }
    public Guid ModuleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
}

public class CreateSubModuleDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Order { get; set; }

    [Range(0, int.MaxValue)]
    public int? EstimatedDurationMinutes { get; set; }
}

public class UpdateSubModuleDto : CreateSubModuleDto
{
}


// Mirrors the original TS `Step` union: a caller gets back JSON shaped like
// { "stepType": "Quiz", "id": "...", ..., "questions": [...] } and can
// switch on "stepType" exactly like the TS type guards did.
[JsonPolymorphic(TypeDiscriminatorPropertyName = "stepType")]
[JsonDerivedType(typeof(ContentStepDto), "Content")]
[JsonDerivedType(typeof(VideoStepDto), "Video")]
[JsonDerivedType(typeof(QuizStepDto), "Quiz")]
public abstract class StepDto
{
    public Guid Id { get; set; }
    public Guid SubModuleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public bool IsFreePreview { get; set; }
    public ContentStatus Status { get; set; }
}

public class ContentStepDto : StepDto
{
    public string Body { get; set; } = string.Empty;
    public List<StepAttachmentDto> Attachments { get; set; } = new();
}

public class VideoStepDto : StepDto
{
    public string VideoUrl { get; set; } = string.Empty;
    public int DurationSeconds { get; set; }
    public string? CaptionsUrl { get; set; }
    public string? Transcript { get; set; }
}

public class QuizStepDto : StepDto
{
    public int PassingScorePercent { get; set; }
    public bool AllowRetake { get; set; }
    public int? TimeLimitSeconds { get; set; }
    public List<QuizQuestionDto> Questions { get; set; } = new();
}

public class StepAttachmentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
}

public class QuizQuestionDto
{
    public Guid Id { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public string? CorrectAnswer { get; set; }
    public int Points { get; set; }
    public List<QuizOptionDto> Options { get; set; } = new();
}

public class QuizOptionDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

// Used for both create (POST) and update (PUT) - a PUT is a full replace of
// the step's own fields and its children (attachments / questions), so the
// two shapes are identical. ASP.NET Core resolves the concrete type from
// the "stepType" field in the request body automatically, same as StepDto.
[JsonPolymorphic(TypeDiscriminatorPropertyName = "stepType")]
[JsonDerivedType(typeof(ContentStepUpsertDto), "Content")]
[JsonDerivedType(typeof(VideoStepUpsertDto), "Video")]
[JsonDerivedType(typeof(QuizStepUpsertDto), "Quiz")]
public abstract class StepUpsertDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Order { get; set; }

    [Range(0, int.MaxValue)]
    public int? EstimatedDurationMinutes { get; set; }

    public bool IsFreePreview { get; set; }

    public ContentStatus Status { get; set; } = ContentStatus.Draft;
}

public class ContentStepUpsertDto : StepUpsertDto
{
    [Required]
    public string Body { get; set; } = string.Empty;

    public List<StepAttachmentUpsertDto> Attachments { get; set; } = new();
}

public class VideoStepUpsertDto : StepUpsertDto
{
    [Required]
    public string VideoUrl { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int DurationSeconds { get; set; }

    public string? CaptionsUrl { get; set; }
    public string? Transcript { get; set; }
}

public class QuizStepUpsertDto : StepUpsertDto
{
    [Range(0, 100)]
    public int PassingScorePercent { get; set; }

    public bool AllowRetake { get; set; }

    [Range(1, int.MaxValue)]
    public int? TimeLimitSeconds { get; set; }

    public List<QuizQuestionUpsertDto> Questions { get; set; } = new();
}

public class StepAttachmentUpsertDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(2048)]
    public string Url { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string MimeType { get; set; } = string.Empty;
}

public class QuizQuestionUpsertDto
{
    [Required, MaxLength(1000)]
    public string Prompt { get; set; } = string.Empty;

    public QuestionType Type { get; set; }

    // Only meaningful when Type == ShortAnswer
    public string? CorrectAnswer { get; set; }

    [Range(0, int.MaxValue)]
    public int Points { get; set; }

    public List<QuizOptionUpsertDto> Options { get; set; } = new();
}

public class QuizOptionUpsertDto
{
    [Required, MaxLength(500)]
    public string Text { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
}


public static class MappingExtensions
{
    // ---------- Course ----------

    public static CourseDto ToDto(this Course course) => new()
    {
        Id = course.Id,
        Title = course.Title,
        Slug = course.Slug,
        Description = course.Description,
        ThumbnailUrl = course.ThumbnailUrl,
        Level = course?.Level,
        Language = course?.Language,
        Price = course?.Price,
        Currency = course?.Currency,
        Status = course.Status,
        Tags = course.CourseTags.Select(ct => ct.Tag.Name).OrderBy(n => n).ToList(),
        CreatedAt = course.CreatedAt,
        UpdatedAt = course.UpdatedAt,
    };

    // ---------- Module ----------

    public static ModuleDto ToDto(this Module module) => new()
    {
        Id = module.Id,
        CourseId = module.CourseId,
        Title = module.Title,
        Description = module.Description,
        Order = module.Order,
        EstimatedDurationMinutes = module.EstimatedDurationMinutes,
        Status = module.Status,
    };

    // ---------- SubModule ----------

    public static SubModuleDto ToDto(this SubModule subModule) => new()
    {
        Id = subModule.Id,
        ModuleId = subModule.ModuleId,
        Title = subModule.Title,
        Description = subModule.Description,
        Order = subModule.Order,
        EstimatedDurationMinutes = subModule.EstimatedDurationMinutes,
    };

    // ---------- Step (entity -> DTO) ----------

    public static StepDto ToDto(this Step step) => step switch
    {
        ContentStep cs => new ContentStepDto
        {
            Id = cs.Id,
            SubModuleId = cs.SubModuleId,
            Title = cs.Title,
            Description = cs.Description,
            Order = cs.Order,
            EstimatedDurationMinutes = cs.EstimatedDurationMinutes,
            IsFreePreview = cs.IsFreePreview,
            Status = cs.Status,
            Body = cs.Body,
            Attachments = cs.Attachments.Select(a => a.ToDto()).ToList(),
        },
        VideoStep vs => new VideoStepDto
        {
            Id = vs.Id,
            SubModuleId = vs.SubModuleId,
            Title = vs.Title,
            Description = vs.Description,
            Order = vs.Order,
            EstimatedDurationMinutes = vs.EstimatedDurationMinutes,
            IsFreePreview = vs.IsFreePreview,
            Status = vs.Status,
            VideoUrl = vs.VideoUrl,
            DurationSeconds = vs.DurationSeconds,
            CaptionsUrl = vs.CaptionsUrl,
            Transcript = vs.Transcript,
        },
        QuizStep qs => new QuizStepDto
        {
            Id = qs.Id,
            SubModuleId = qs.SubModuleId,
            Title = qs.Title,
            Description = qs.Description,
            Order = qs.Order,
            EstimatedDurationMinutes = qs.EstimatedDurationMinutes,
            IsFreePreview = qs.IsFreePreview,
            Status = qs.Status,
            PassingScorePercent = qs.PassingScorePercent,
            AllowRetake = qs.AllowRetake,
            TimeLimitSeconds = qs.TimeLimitSeconds,
            Questions = qs.Questions.Select(q => q.ToDto()).ToList(),
        },
        _ => throw new NotSupportedException($"Unknown step type '{step.GetType().Name}'."),
    };

    public static StepAttachmentDto ToDto(this StepAttachment attachment) => new()
    {
        Id = attachment.Id,
        Name = attachment.Name,
        Url = attachment.Url,
        MimeType = attachment.MimeType,
    };

    public static QuizQuestionDto ToDto(this QuizQuestion question) => new()
    {
        Id = question.Id,
        Prompt = question.Prompt,
        Type = question.Type,
        CorrectAnswer = question.CorrectAnswer,
        Points = question.Points,
        Options = question.Options.Select(o => o.ToDto()).ToList(),
    };

    public static QuizOptionDto ToDto(this QuizOption option) => new()
    {
        Id = option.Id,
        Text = option.Text,
        IsCorrect = option.IsCorrect,
    };

    // ---------- Step (upsert DTO -> new entity) ----------

    public static Step ToEntity(this StepUpsertDto dto, Guid subModuleId)
    {
        Step step = dto switch
        {
            ContentStepUpsertDto c => new ContentStep
            {
                Body = c.Body,
                Attachments = c.Attachments
                    .Select(a => new StepAttachment { Name = a.Name, Url = a.Url, MimeType = a.MimeType })
                    .ToList(),
            },
            VideoStepUpsertDto v => new VideoStep
            {
                VideoUrl = v.VideoUrl,
                DurationSeconds = v.DurationSeconds,
                CaptionsUrl = v.CaptionsUrl,
                Transcript = v.Transcript,
            },
            QuizStepUpsertDto q => new QuizStep
            {
                PassingScorePercent = q.PassingScorePercent,
                AllowRetake = q.AllowRetake,
                TimeLimitSeconds = q.TimeLimitSeconds,
                Questions = q.Questions.Select(qq => new QuizQuestion
                {
                    Prompt = qq.Prompt,
                    Type = qq.Type,
                    CorrectAnswer = qq.CorrectAnswer,
                    Points = qq.Points,
                    Options = qq.Options
                        .Select(o => new QuizOption { Text = o.Text, IsCorrect = o.IsCorrect })
                        .ToList(),
                }).ToList(),
            },
            _ => throw new NotSupportedException($"Unknown step upsert DTO '{dto.GetType().Name}'."),
        };

        step.Id = Guid.NewGuid();
        step.SubModuleId = subModuleId;
        step.Title = dto.Title;
        step.Description = dto.Description;
        step.Order = dto.Order;
        step.EstimatedDurationMinutes = dto.EstimatedDurationMinutes;
        step.IsFreePreview = dto.IsFreePreview;
        step.Status = dto.Status;

        return step;
    }

    // ---------- Step (upsert DTO -> apply to existing entity, for PUT) ----------

    public static void ApplyTo(this StepUpsertDto dto, Step entity)
    {
        entity.Title = dto.Title;
        entity.Description = dto.Description;
        entity.Order = dto.Order;
        entity.EstimatedDurationMinutes = dto.EstimatedDurationMinutes;
        entity.IsFreePreview = dto.IsFreePreview;
        entity.Status = dto.Status;

        switch (entity, dto)
        {
            case (ContentStep ce, ContentStepUpsertDto cd):
                ce.Body = cd.Body;
                // Relies on ContentStep.Attachments being a required (non-nullable
                // FK) relationship, so EF deletes anything removed from the
                // collection instead of just detaching it.
                ce.Attachments.Clear();
                foreach (var a in cd.Attachments)
                    ce.Attachments.Add(new StepAttachment { Name = a.Name, Url = a.Url, MimeType = a.MimeType });
                break;

            case (VideoStep ve, VideoStepUpsertDto vd):
                ve.VideoUrl = vd.VideoUrl;
                ve.DurationSeconds = vd.DurationSeconds;
                ve.CaptionsUrl = vd.CaptionsUrl;
                ve.Transcript = vd.Transcript;
                break;

            case (QuizStep qe, QuizStepUpsertDto qd):
                qe.PassingScorePercent = qd.PassingScorePercent;
                qe.AllowRetake = qd.AllowRetake;
                qe.TimeLimitSeconds = qd.TimeLimitSeconds;
                qe.Questions.Clear();
                foreach (var q in qd.Questions)
                    qe.Questions.Add(new QuizQuestion
                    {
                        Prompt = q.Prompt,
                        Type = q.Type,
                        CorrectAnswer = q.CorrectAnswer,
                        Points = q.Points,
                        Options = q.Options
                            .Select(o => new QuizOption { Text = o.Text, IsCorrect = o.IsCorrect })
                            .ToList(),
                    });
                break;

            default:
                // e.g. PUTing a ContentStepUpsertDto against an existing QuizStep.
                // A step's type is fixed at creation (TPC puts each type in its
                // own table) - changing it means delete + recreate, not update.
                throw new InvalidOperationException(
                    $"Cannot change step type from '{entity.GetType().Name}' to '{dto.GetType().Name}'. Delete and recreate the step instead.");
        }
    }
}
