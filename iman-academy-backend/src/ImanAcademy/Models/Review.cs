using System;
using System.Collections.Generic;
using System.Reflection;

namespace ImanAcademy.Models;

// One review table per reviewable type rather than a single polymorphic
// "Reviews" table with a (ReviewableType, ReviewableId) pair. EF Core/SQL
// don't support a real FK against "one of several tables", so a single
// polymorphic table would mean giving up referential integrity on the
// most important column. Three small tables keeps every FK enforced,
// at the cost of a little duplication between them.

public class CourseReview
{
    public Guid Id { get; set; }

    public Guid ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; } = null!;

    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class ModuleReview
{
    public Guid Id { get; set; }

    public Guid ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; } = null!;

    public Guid ModuleId { get; set; }
    public Module Module { get; set; } = null!;

    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// NOTE: StepId is intentionally NOT a navigation/FK property. Step is
// mapped TPC (ContentSteps / VideoSteps / QuizSteps as separate physical
// tables), so there's no single "Steps" table left for a real foreign key
// to point at. StepId is a plain, indexed Guid - validated at the
// application layer (e.g. check it exists in one of the three step
// repositories before saving a review) rather than by the database.
// If enforced referential integrity here matters more than TPC's insert
// performance, switching Step back to TPT would let this become a real FK.
public class StepReview
{
    public Guid Id { get; set; }

    public Guid ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; } = null!;

    public Guid StepId { get; set; }

    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
