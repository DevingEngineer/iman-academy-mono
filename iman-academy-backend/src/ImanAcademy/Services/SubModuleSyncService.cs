using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.EntityFrameworkCore;

public class SubModuleSyncService
{
    private readonly ImanAcademyContext _db;

    public SubModuleSyncService(ImanAcademyContext db) => _db = db;

    public async Task<SubModuleDto> GetBySubModuleAsync(Guid subModuleId, CancellationToken ct)
    {
        var subModule = await _db.SubModules.AsNoTracking()
           .FirstOrDefaultAsync(s => s.Id == subModuleId);

       

        // 3 queries total for steps, regardless of how many sub-modules/steps exist.
        var contentSteps = await _db.Set<ContentStep>().AsNoTracking()
            .Include(c => c.Attachments)
            .Where(c => c.SubModuleId == subModuleId)
            .ToListAsync(ct);

        var videoSteps = await _db.Set<VideoStep>().AsNoTracking()
            .Where(v => v.SubModuleId == subModuleId)
            .ToListAsync(ct);

        var quizSteps = await _db.Set<QuizStep>().AsNoTracking()
            .Include(q => q.Questions).ThenInclude(q => q.Options)
            .Where(q => q.SubModuleId == subModuleId)
            .ToListAsync(ct);

        var contentBySubModule = contentSteps.ToLookup(c => c.SubModuleId);
        var videoBySubModule = videoSteps.ToLookup(v => v.SubModuleId);
        var quizBySubModule = quizSteps.ToLookup(q => q.SubModuleId);

        var steps = new List<StepDto>();
        steps.AddRange(contentBySubModule[subModule.Id].Select(c=>c.ToDto()));
        steps.AddRange(videoBySubModule[subModule.Id].Select(v=>v.ToDto()));
        steps.AddRange(quizBySubModule[subModule.Id].Select(q=>q.ToDto()));

        return new SubModuleDto
        {
            Id = subModule.Id,
            ModuleId = subModule.ModuleId,
            Title = subModule.Title,
            Description = subModule.Description,
            Order = subModule.Order,
            EstimatedDurationMinutes = subModule.EstimatedDurationMinutes,
            Steps = steps.OrderBy(s => s.Order).ToList()
        };
    }

    public async Task<SubModuleDto> SyncAsync(SubModuleDto dto, CancellationToken ct)
    {
        SubModule subModule;

        if (dto.Id is Guid subModuleId)
        {
            subModule = await _db.SubModules
                .FirstOrDefaultAsync(s => s.Id == subModuleId, ct)
                ?? throw new KeyNotFoundException($"SubModule {subModuleId} not found.");
        }
        else
        {
            subModule = new SubModule { Id = Guid.NewGuid() };
            _db.SubModules.Add(subModule);
        }

        subModule.ModuleId = dto.ModuleId;
        subModule.Title = dto.Title;
        subModule.Description = dto.Description;
        subModule.Order = dto.Order;
        subModule.EstimatedDurationMinutes = dto.EstimatedDurationMinutes;

        // Load existing steps per-table (TPC: no shared table, so no single polymorphic Include).
        var contentSteps = await _db.Set<ContentStep>()
            .Include(c => c.Attachments)
            .Where(c => c.SubModuleId == subModule.Id)
            .ToListAsync(ct);

        var videoSteps = await _db.Set<VideoStep>()
            .Where(v => v.SubModuleId == subModule.Id)
            .ToListAsync(ct);

        var quizSteps = await _db.Set<QuizStep>()
            .Include(q => q.Questions).ThenInclude(q => q.Options)
            .Where(q => q.SubModuleId == subModule.Id)
            .ToListAsync(ct);

        // Combined lookup: Id -> (entity, its concrete Set<T> removal action)
        var existingById = new Dictionary<Guid, Step>();
        foreach (var s in contentSteps) existingById[s.Id] = s;
        foreach (var s in videoSteps) existingById[s.Id] = s;
        foreach (var s in quizSteps) existingById[s.Id] = s;

        var seenIds = new HashSet<Guid>();

        foreach (var stepDto in dto.Steps ?? Enumerable.Empty<StepDto>())
        {
            if (stepDto.Id is Guid stepId && existingById.TryGetValue(stepId, out var existing))
            {
                seenIds.Add(stepId);

                if (StepTypeMatches(existing, stepDto))
                {
                    UpdateStep(existing, stepDto);
                }
                else
                {
                    // Type changed -> different table entirely. Remove from the old
                    // table, insert into the new one, keep the same Id.
                    RemoveStep(existing);
                    var replacement = CreateStep(stepDto, forcedId: stepId);
                    AddStep(subModule.Id, replacement);
                }
            }
            else
            {
                AddStep(subModule.Id, CreateStep(stepDto, forcedId: stepDto.Id ?? Guid.NewGuid()));
            }
        }

        // Anything that existed before but wasn't in the incoming payload -> delete.
        foreach (var (id, entity) in existingById)
        {
            if (!seenIds.Contains(id))
                RemoveStep(entity);
        }

        await _db.SaveChangesAsync(ct);

        return await MapToDtoAsync(subModule.Id, ct);
    }

    // --- type dispatch helpers ---

    private static bool StepTypeMatches(Step entity, StepDto dto) => (entity, dto) switch
    {
        (ContentStep, ContentStepDto) => true,
        (VideoStep, VideoStepDto) => true,
        (QuizStep, QuizStepDto) => true,
        _ => false
    };

    private Step CreateStep(StepDto dto, Guid forcedId)
    {
        Step entity = dto switch
        {
            ContentStepDto c => new ContentStep
            {
                Body = c.Body,
                Attachments = c.Attachments.Select(a => new StepAttachment
                {
                    Id = a.Id == Guid.Empty ? Guid.NewGuid() : a.Id,
                    Name = a.Name,
                    Url = a.Url,
                    MimeType = a.MimeType
                }).ToList()
            },
            VideoStepDto v => new VideoStep
            {
                VideoUrl = v.VideoUrl,
                DurationSeconds = v.DurationSeconds,
                CaptionsUrl = v.CaptionsUrl,
                Transcript = v.Transcript
            },
            QuizStepDto q => new QuizStep
            {
                PassingScorePercent = q.PassingScorePercent,
                AllowRetake = q.AllowRetake,
                TimeLimitSeconds = q.TimeLimitSeconds,
                Questions = q.Questions.Select(CreateQuestion).ToList()
            },
            _ => throw new NotSupportedException($"Unsupported step type '{dto.GetType().Name}'.")
        };

        entity.Id = forcedId;
        ApplyCommon(entity, dto);
        return entity;
    }

    private void UpdateStep(Step entity, StepDto dto)
    {
        ApplyCommon(entity, dto);

        switch (entity, dto)
        {
            case (ContentStep ce, ContentStepDto cd):
                ce.Body = cd.Body;
                SyncChildren(
                    ce.Attachments, cd.Attachments,
                    dtoId: a => a.Id == Guid.Empty ? null : a.Id,
                    entityId: a => a.Id,
                    create: a => new StepAttachment
                    {
                        Id = a.Id == Guid.Empty ? Guid.NewGuid() : a.Id,
                        ContentStepId = ce.Id,
                        Name = a.Name,
                        Url = a.Url,
                        MimeType = a.MimeType
                    },
                    update: (a, ad) => { a.Name = ad.Name; a.Url = ad.Url; a.MimeType = ad.MimeType; });
                break;

            case (VideoStep ve, VideoStepDto vd):
                ve.VideoUrl = vd.VideoUrl;
                ve.DurationSeconds = vd.DurationSeconds;
                ve.CaptionsUrl = vd.CaptionsUrl;
                ve.Transcript = vd.Transcript;
                break;

            case (QuizStep qe, QuizStepDto qd):
                qe.PassingScorePercent = qd.PassingScorePercent;
                qe.AllowRetake = qd.AllowRetake;
                qe.TimeLimitSeconds = qd.TimeLimitSeconds;
                SyncChildren(
                    qe.Questions, qd.Questions,
                    dtoId: q => q.Id,
                    entityId: q => q.Id,
                    create: q => { var e = CreateQuestion(q); e.QuizStepId = qe.Id; return e; },
                    update: UpdateQuestion);
                break;
        }
    }

    private void AddStep(Guid subModuleId, Step step)
    {
        step.SubModuleId = subModuleId;
        switch (step)
        {
            case ContentStep c: _db.Set<ContentStep>().Add(c); break;
            case VideoStep v: _db.Set<VideoStep>().Add(v); break;
            case QuizStep q: _db.Set<QuizStep>().Add(q); break;
        }
    }

    private void RemoveStep(Step step)
    {
        switch (step)
        {
            case ContentStep c: _db.Set<ContentStep>().Remove(c); break;
            case VideoStep v: _db.Set<VideoStep>().Remove(v); break;
            case QuizStep q: _db.Set<QuizStep>().Remove(q); break;
        }
    }

    private static void ApplyCommon(Step entity, StepDto dto)
    {
        entity.Title = dto.Title;
        entity.Description = dto.Description;
        entity.Order = dto.Order;
        entity.EstimatedDurationMinutes = dto.EstimatedDurationMinutes;
        entity.IsFreePreview = dto.IsFreePreview;
        entity.Status = dto.Status;
    }

    // --- questions / options ---

    private static QuizQuestion CreateQuestion(QuizQuestionDto q) => new()
    {
        Id = q.Id ?? Guid.NewGuid(),
        Prompt = q.Prompt,
        Type = q.Type,
        CorrectAnswer = q.CorrectAnswer,
        Points = q.Points,
        Options = q.Options.Select(o => new QuizOption
        {
            Id = o.Id ?? Guid.NewGuid(),
            Text = o.Text,
            IsCorrect = o.IsCorrect
        }).ToList()
    };

    private void UpdateQuestion(QuizQuestion entity, QuizQuestionDto dto)
    {
        entity.Prompt = dto.Prompt;
        entity.Type = dto.Type;
        entity.CorrectAnswer = dto.CorrectAnswer;
        entity.Points = dto.Points;

        SyncChildren(
            entity.Options, dto.Options,
            dtoId: o => o.Id,
            entityId: o => o.Id,
            create: o => new QuizOption
            {
                Id = o.Id ?? Guid.NewGuid(),
                QuizQuestionId = entity.Id,
                Text = o.Text,
                IsCorrect = o.IsCorrect
            },
            update: (o, od) => { o.Text = od.Text; o.IsCorrect = od.IsCorrect; });
    }

    // --- generic id-keyed collection sync (attachments / questions / options) ---

    private void SyncChildren<TEntity, TDto>(
        ICollection<TEntity> existing,
        IEnumerable<TDto> incoming,
        Func<TDto, Guid?> dtoId,
        Func<TEntity, Guid> entityId,
        Func<TDto, TEntity> create,
        Action<TEntity, TDto> update)
        where TEntity : class
    {
        var byId = existing.ToDictionary(entityId);
        var seen = new HashSet<Guid>();

        foreach (var dto in incoming)
        {
            if (dtoId(dto) is Guid id && byId.TryGetValue(id, out var entity))
            {
                update(entity, dto);
                seen.Add(id);
            }
            else
            {
                existing.Add(create(dto));
            }
        }

        foreach (var (id, entity) in byId)
        {
            if (!seen.Contains(id))
            {
                existing.Remove(entity);
                _db.Remove(entity); // needed: removing from nav collection alone won't delete an existing row
            }
        }
    }

    // --- mapping back out ---

    private async Task<SubModuleDto> MapToDtoAsync(Guid subModuleId, CancellationToken ct)
    {
        var subModule = await _db.SubModules.AsNoTracking()
            .FirstAsync(s => s.Id == subModuleId, ct);

        var contentSteps = await _db.Set<ContentStep>().AsNoTracking()
            .Include(c => c.Attachments)
            .Where(c => c.SubModuleId == subModuleId)
            .ToListAsync(ct);

        var videoSteps = await _db.Set<VideoStep>().AsNoTracking()
            .Where(v => v.SubModuleId == subModuleId)
            .ToListAsync(ct);

        var quizSteps = await _db.Set<QuizStep>().AsNoTracking()
            .Include(q => q.Questions).ThenInclude(q => q.Options)
            .Where(q => q.SubModuleId == subModuleId)
            .ToListAsync(ct);

        var steps = new List<StepDto>();
        steps.AddRange(contentSteps.Select(c => (StepDto)new ContentStepDto
        {
            Id = c.Id,
            SubModuleId = c.SubModuleId,
            Title = c.Title,
            Description = c.Description,
            Order = c.Order,
            EstimatedDurationMinutes = c.EstimatedDurationMinutes,
            IsFreePreview = c.IsFreePreview,
            Status = c.Status,
            Body = c.Body,
            Attachments = c.Attachments.Select(a => new StepAttachmentDto
            { Id = a.Id, Name = a.Name, Url = a.Url, MimeType = a.MimeType }).ToList()
        }));
        steps.AddRange(videoSteps.Select(v => (StepDto)new VideoStepDto
        {
            Id = v.Id,
            SubModuleId = v.SubModuleId,
            Title = v.Title,
            Description = v.Description,
            Order = v.Order,
            EstimatedDurationMinutes = v.EstimatedDurationMinutes,
            IsFreePreview = v.IsFreePreview,
            Status = v.Status,
            VideoUrl = v.VideoUrl,
            DurationSeconds = v.DurationSeconds,
            CaptionsUrl = v.CaptionsUrl,
            Transcript = v.Transcript
        }));
        steps.AddRange(quizSteps.Select(q => (StepDto)new QuizStepDto
        {
            Id = q.Id,
            SubModuleId = q.SubModuleId,
            Title = q.Title,
            Description = q.Description,
            Order = q.Order,
            EstimatedDurationMinutes = q.EstimatedDurationMinutes,
            IsFreePreview = q.IsFreePreview,
            Status = q.Status,
            PassingScorePercent = q.PassingScorePercent,
            AllowRetake = q.AllowRetake,
            TimeLimitSeconds = q.TimeLimitSeconds,
            Questions = q.Questions.Select(qq => new QuizQuestionDto
            {
                Id = qq.Id,
                Prompt = qq.Prompt,
                Type = qq.Type,
                CorrectAnswer = qq.CorrectAnswer,
                Points = qq.Points,
                Options = qq.Options.Select(o => new QuizOptionDto
                { Id = o.Id, Text = o.Text, IsCorrect = o.IsCorrect }).ToList()
            }).ToList()
        }));

        return new SubModuleDto
        {
            Id = subModule.Id,
            ModuleId = subModule.ModuleId,
            Title = subModule.Title,
            Description = subModule.Description,
            Order = subModule.Order,
            EstimatedDurationMinutes = subModule.EstimatedDurationMinutes,
            Steps = steps.OrderBy(s => s.Order).ToList()
        };
    }
}