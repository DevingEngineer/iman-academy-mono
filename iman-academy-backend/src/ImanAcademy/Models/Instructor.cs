namespace ImanAcademy.Models;

public class Instructor
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public ICollection<CourseInstructor> CourseInstructors { get; set; } = new List<CourseInstructor>();
}

// Explicit join entity for the Course <-> Instructor many-to-many relationship.
// (Using an explicit entity rather than EF Core's implicit skip-navigation join
// so it's easy to add fields like Role or JoinedAt later without a migration surprise.)
public class CourseInstructor
{
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public Guid InstructorId { get; set; }
    public Instructor Instructor { get; set; } = null!;
}

