namespace ImanAcademy.Models
{
    // Replaces Course.Tags (previously a JSON-serialized List<string>) with a
    // real, reusable entity - lets you rename a tag once, query "courses with
    // tag X" efficiently, and avoid duplicate near-identical tag strings.
    public class Tag
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public ICollection<CourseTag> CourseTags { get; set; } = new List<CourseTag>();
    }

    public class CourseTag
    {
        public Guid CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public Guid TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}
