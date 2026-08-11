namespace ImanAcademy.Models;

public class SubModule
{
    public Guid Id { get; set; }

    public Guid ModuleId { get; set; }
    public Module Module { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public int? EstimatedDurationMinutes { get; set; }

    public ICollection<Step> Steps { get; set; } = new List<Step>();
}